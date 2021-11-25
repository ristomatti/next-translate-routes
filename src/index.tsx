import React, { ComponentType } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { NextRouter, useRouter as useNextRouter } from 'next/router'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { compile, parse as parsePath } from 'path-to-regexp'
import { parse as parseQuery, stringify as stringifyQuery, ParsedUrlQuery } from 'querystring'
import { format as formatUrl, parse as parseUrl, UrlObject } from 'url'

import type { Key } from 'path-to-regexp'
import type { TRouteBranch } from './types'
import type { PrefetchOptions } from 'next/dist/shared/lib/router/router'

type Options<F extends 'string' | 'object' = 'string' | 'object'> = {
  format?: F
}

type Url = UrlObject | string

interface TransitionOptions {
  shallow?: boolean
  locale?: string | false
  scroll?: boolean
}

const getRoutesTree = () => JSON.parse(process.env.NEXT_PUBLIC_ROUTES || 'null') as TRouteBranch
const getLocales = () => (process.env.NEXT_PUBLIC_LOCALES || '').split(',') as string[]
const getDefaultLocale = () => process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string

/**
 * A segment can be ignored by setting its path to "." in _routes.json.
 * It can be done for some lang only and not others.
 *
 * It can cause troubles with the redirections. Ex:
 * Given the /a/[b]/[c] and /a/[b]/[c]/d file paths. [b] is ignored and the b param is merged with the c param: ":b-:c".
 * Then /a/b/c will be redirected to /a/b-c and that is fine.
 * But /a/b-c/d will be redirected to /a/b-c-d and that is not fine.
 *
 * To handle this case, one can add a path-to-regex pattern to the default ignore token. Ex: '.(\\d+)', or '.(\[\^-\]+)'.
 * This path-to-regex pattern will be added after the segment name in the redirect.
 * Then /a/b(\\d+)/c will be redirected to /a/b-c, and /a/b-c/d will not be redirected to /a/b-c-d.
 * /!\ This is only handled in default paths (i.e. "/": ".(\\d+)" or "/": { "default": ".(\\d+)" }), not in lang-specific paths.
 */
export const ignoreSegmentPathRegex = /^\.(\(.+\))?$/

/** Get children + (grand)children of children whose path must be ignord (path === '.' or path === `.(${pathRegex})`) */
const getAllCandidates = (lang: string, children?: TRouteBranch[]): TRouteBranch[] =>
  children
    ? children.reduce((acc, child) => {
        const path = child.paths[lang] || child.paths.default
        return [...acc, ...(path === '' ? getAllCandidates(lang, child.children) : [child])]
      }, [] as TRouteBranch[])
    : []

const getSingleDynamicPathPartName = (pathPartName: string) => /^\[([^/[\].]+)\]$/.exec(pathPartName)?.[1] || null
const getSpreadDynamicPathPartName = (pathPartName: string) =>
  /^\[\[?\.{3}([^/[\].]+)\]?\]$/.exec(pathPartName)?.[1] || null

/**
 * Recursively translate paths from file path, and extract parameters
 */
const translatePathParts = ({
  locale,
  pathParts,
  routeBranch,
  query,
}: {
  locale: string
  /** Can be a bare name or a dynamic value */
  pathParts: string[]
  routeBranch: TRouteBranch
  query?: ParsedUrlQuery
}): { augmentedQuery?: ParsedUrlQuery; translatedPathParts: string[] } => {
  const { children } = routeBranch

  if (!Array.isArray(pathParts)) {
    throw new Error('Wrong pathParts argument in translatePathParts')
  }

  if (pathParts.length === 0) {
    return { translatedPathParts: [], augmentedQuery: query }
  }

  const pathPart = pathParts[0]
  const nextPathParts = pathParts.slice(1)

  if (!pathPart) {
    return translatePathParts({ locale, pathParts: nextPathParts, routeBranch, query })
  }

  const candidates = getAllCandidates(locale, children).filter((child) =>
    pathParts.length === 1 // Last path part
      ? !child.children ||
        child.children.some((grandChild) => grandChild.name === 'index' || /\[\[\.{3}\w+\]\]/.exec(grandChild.name))
      : !!child.children,
  )

  let currentQuery = query
  let childRouteBranch = candidates.find(({ name }) => pathPart === name)
  // If defined: pathPart is a route segment name that should be translated.
  // If dynamic, the value should already be contained in the query.

  if (!childRouteBranch) {
    // If not defined: pathPart is either a dynamic value either a wrong path.

    childRouteBranch = candidates.find((candidate) => getSingleDynamicPathPartName(candidate.name))
    if (childRouteBranch) {
      // Single dynamic route segment value => store it in the query
      currentQuery = {
        ...currentQuery,
        [childRouteBranch.name.replace(/\[|\]|\./g, '')]: pathPart,
      }
    } else {
      childRouteBranch = candidates.find((candidate) => getSpreadDynamicPathPartName(candidate.name))
      if (childRouteBranch) {
        // Catch all route => store it in the query, then return the current data.
        currentQuery = {
          ...currentQuery,
          [childRouteBranch.name.replace(/\[|\]|\./g, '')]: pathParts,
        }
        return {
          translatedPathParts: [childRouteBranch.name], // [childRouteBranch.paths[locale] || childRouteBranch.paths.default],
          augmentedQuery: currentQuery,
        }
      }
      // No route match => return the remaining path as is
      return { translatedPathParts: pathParts, augmentedQuery: query }
    }
  }

  // Get the descendants translated path parts and query values
  const { augmentedQuery, translatedPathParts: nextTranslatedPathsParts } = childRouteBranch?.children
    ? translatePathParts({ locale, pathParts: nextPathParts, routeBranch: childRouteBranch, query: currentQuery })
    : { augmentedQuery: currentQuery, translatedPathParts: [] }

  const translatedPathPart = childRouteBranch.paths[locale] || childRouteBranch.paths.default

  return {
    translatedPathParts: [
      ...(ignoreSegmentPathRegex.test(translatedPathPart) ? [] : [translatedPathPart]),
      ...(nextTranslatedPathsParts || []),
    ],
    augmentedQuery,
  }
}

export const removeLangPrefix = (pathParts: string[]): string[] => {
  const routesTree = getRoutesTree()
  const locales = getLocales()
  const defaultLocale = getDefaultLocale()

  const getLangRoot = (lang: string) => routesTree.paths[lang] || routesTree.paths.default

  const defaultLocaleRoot = getLangRoot(defaultLocale)
  const hasLangPrefix = locales.includes(pathParts[0])
  const hasDefaultLocalePrefix = !hasLangPrefix && !!defaultLocaleRoot && pathParts[0] === defaultLocaleRoot

  if (pathParts[1] === 'any' && pathParts[0] === 'en') {
    console.log('From removeLangPrefix.', {
      pathParts,
      defaultLocaleRoot,
      hasLangPrefix,
      hasDefaultLocalePrefix,
      defaultLocale,
      rootPaths: routesTree.paths,
    })
  }

  if (!hasLangPrefix && !hasDefaultLocalePrefix) {
    return pathParts
  }

  const locale = hasLangPrefix ? pathParts[0] : defaultLocale
  const localeRootParts = getLangRoot(locale)?.split('/')
  const nbPathPartsToRemove =
    (hasLangPrefix ? 1 : 0) +
    (localeRootParts && (!hasLangPrefix || pathParts[1] === localeRootParts[0]) ? localeRootParts.length : 0)

  if (pathParts[1] === 'any' && pathParts[0] === 'en') {
    console.log('From removeLangPrefix.', {
      pathParts,
      locale,
      hasLangPrefix,
      hasDefaultLocalePrefix,
      langRoot: getLangRoot(locale),
      nbPathPartsToRemove,
    })
  }

  return pathParts.slice(nbPathPartsToRemove)
}

/**
 * Translate path into option.locale locale, or if not defined, in current locale
 *
 * @param url string url or UrlObject
 * @param locale string
 * @param options (optional)
 * @param options.format `'string'` or `'object'`
 * @return string if `options.format === 'string'`,
 * UrlObject if `options.format === 'object'`,
 * same type as url if options.format is not defined
 */
export function translatePath<U extends string | UrlObject, F extends 'string' | 'object'>(
  url: U,
  locale: string,
  options?: Options<F>,
): 'string' | 'object' extends F
  ? U extends string
    ? string
    : U extends UrlObject
    ? UrlObject
    : Url
  : F extends 'string'
  ? string
  : UrlObject

export function translatePath(url: Url, locale: string, { format }: Options = {}): Url {
  const routesTree = getRoutesTree()
  const returnFormat = format || typeof url
  const urlObject = typeof url === 'object' ? (url as UrlObject) : parseUrl(url, true)
  const { pathname, query, hash } = urlObject

  if (!pathname || !locale) {
    return returnFormat === 'object' ? url : formatUrl(url)
  }

  const pathParts = removeLangPrefix(pathname.replace(/^\//, '').split('/'))

  const { translatedPathParts, augmentedQuery = {} } = translatePathParts({
    locale,
    pathParts,
    query: parseQuery(typeof query === 'string' ? query : stringifyQuery(query || {})),
    routeBranch: routesTree,
  })
  const path = translatedPathParts.join('/')
  const compiledPath = compile(path, { validate: false })(augmentedQuery)
  const paramNames = (parsePath(path).filter((token) => typeof token === 'object') as Key[]).map((token) => token.name)
  const remainingQuery = Object.keys(augmentedQuery).reduce(
    (acc, key) => ({
      ...acc,
      ...(paramNames.includes(key)
        ? {}
        : { [key]: (typeof query === 'object' && query?.[key]) || augmentedQuery[key] }),
    }),
    {},
  )

  const translatedPathname = `${routesTree.paths[locale] ? `/${routesTree.paths[locale]}` : ''}/${compiledPath}`

  const translatedUrlObject = {
    ...urlObject,
    hash,
    pathname: translatedPathname,
    query: remainingQuery,
  }

  return returnFormat === 'object' ? translatedUrlObject : formatUrl(translatedUrlObject)
}

/**
 * Translate url into option.locale locale, or if not defined, in current locale
 *
 * @param url string url or UrlObject
 * @param locale string
 * @param options (optional)
 * @param options.format `'string'` or `'object'`
 * @return string if `options.format === 'string'`,
 * UrlObject if `options.format === 'object'`,
 * same type as url if options.format is not defined
 */
export const translateUrl = ((url, locale, options) => {
  const defaultLocale = getDefaultLocale()

  // Handle external urls
  const parsedUrl: UrlObject = typeof url === 'string' ? parseUrl(url) : url
  if (parsedUrl.host) {
    if (typeof window === 'undefined' || parsedUrl.host !== parseUrl(window.location.href).host) {
      return url
    }
  }

  const translatedPath = translatePath(url, locale, options)
  const prefix = locale === defaultLocale ? '' : `/${locale}`

  if (typeof translatedPath === 'object') {
    return {
      ...(translatedPath as UrlObject),
      pathname: prefix + translatedPath.pathname,
    }
  }
  return prefix + translatedPath
}) as typeof translatePath

/**
 * Link component that handle route translations
 */
export const Link: React.FC<LinkProps> = ({ href, as, locale, ...props }) => {
  const { locale: routerLocale } = useNextRouter()
  const language = locale || (routerLocale as string)
  return <NextLink href={translateUrl(as || href, language, { format: 'string' })} locale={false} {...props} />
}

const enhanceNextRouter = ({ push, replace, prefetch, locale, ...otherRouterProps }: NextRouter): NextRouter => ({
  push: (url: Url, as?: Url, options?: TransitionOptions) => {
    const translatedPath =
      options?.locale || locale
        ? translatePath(as || url, options?.locale || (locale as string), { format: 'object' })
        : url
    return push(translatedPath, as || translatedPath, options)
  },
  replace: (url: Url, as?: Url, options?: TransitionOptions) => {
    const translatedPath =
      options?.locale || locale
        ? translatePath(as || url, options?.locale || (locale as string), { format: 'object' })
        : url
    return replace(translatedPath, as || translatedPath, options)
  },
  prefetch: (inputUrl: string, asPath?: string, options?: PrefetchOptions) => {
    const translatedPath =
      options?.locale || locale
        ? (translatePath(asPath || inputUrl, options?.locale || (locale as string), { format: 'string' }) as string)
        : inputUrl
    return prefetch(inputUrl, asPath || translatedPath, options)
  },
  locale,
  ...otherRouterProps,
})

/**
 * Get router with route translation capabilities
 *
 * @deprecated since version 1.2.0
 * Use withTranslateRoutes in _app instead, then use Next useRouter (`next/router`)
 */
export const useRouter = (): NextRouter => {
  const nextRouter = useNextRouter()
  return enhanceNextRouter(nextRouter)
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Inject router prop with route translation capabilities
 *
 * @deprecated since version 1.2.0
 * Use withTranslateRoutes in _app instead, then use Next withRouter (`next/router`)
 */
export const withRouter = <P extends Record<string, any>>(Component: ComponentType<{ router: NextRouter } & P>) =>
  Object.assign((props: P) => <Component router={useNextRouter()} {...props} />, {
    displayName: `withRouter(${Component.displayName})`,
  })

/**
 * Must wrap the App component in `pages/_app`.
 * This HOC will make the route push, replace, and refetch functions able to translate routes.
 */
export const withTranslateRoutes = <A extends ComponentType<any>>(AppComponent: A) =>
  Object.assign(
    (props: any) => {
      if (!getRoutesTree()) {
        throw new Error(
          '> next-translate-routes - No routes tree defined. next-translate-routes plugin is probably missing from next.config.js',
        )
      }

      const nextRouter = useNextRouter()

      if (nextRouter && !nextRouter.locale) {
        const fallbackLocale = getDefaultLocale() || getLocales()[0]
        nextRouter.locale = fallbackLocale
        console.error(`> next-translate-routes - No locale prop in Router: fallback to ${fallbackLocale}.`)
      }

      return (
        <RouterContext.Provider value={nextRouter && enhanceNextRouter(nextRouter)}>
          <AppComponent {...props} />
        </RouterContext.Provider>
      )
    },
    { displayName: `withTranslateRoutes(${AppComponent.displayName})` },
  )

export default withTranslateRoutes
