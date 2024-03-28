/// <reference types="node" />
/// <reference types="node" />
import type { ParsedUrlQuery } from 'querystring';
import type { UrlObject } from 'url';
import type { TRouteBranch } from '../types';
declare enum MATCH_TYPE {
    STATIC = "static",
    DYNAMIC = "dynamic",
    MATCHALL = "match-all"
}
type TParsedPathParts = {
    additionalQuery: ParsedUrlQuery;
    parsedPathParts: string[];
    firstMatchType: MATCH_TYPE;
};
/**
 * Recursively parse paths to identify the matching file path, and extract the parameters
 *
 * We must do this taking care of the priorities:
 * 1. static match among the current route branch children
 * 2. static match among among the descendants of a child that is path-ignored
 * 3. dynamic match among the current route branch children
 * 4. dynamic match among among the descendants of a child that is path-ignored
 * 5. match all match among the current route branch children
 * 6. match all match among among the descendants of a child that is path-ignored
 */
export declare const parsePathParts: ({ locale, pathParts, routeBranch, }: {
    locale: string;
    /**
     * The path parts to parse using the routeBranch children
     * A path part can be a bare name or a dynamic value
     */
    pathParts?: string[] | undefined;
    routeBranch: TRouteBranch;
}) => TParsedPathParts | undefined;
/**
 * Parse a translated url to get the corresponding file url (UrlObject)
 *
 * Ex: `urlToFileUrl('/fr/mon/url/de/france', 'fr')` => `{ pathname: '/my/url/from/[country], query: { country: 'france' } }`
 *
 * @param url The url to parse: can be a string, an URL or an UrlObject
 * @param locale (optional) The locale corresponding to the url translation.
 * If omitted, urlToFileUrl will look for the locale in the first path part.
 * If it does not match a locale, urlToFileUrl will use the default locale.
 *
 * @returns The file path based, Next.js format, url in UrlObject format
 * if the url successfully matched a file path, and undefined otherwise
 */
export declare const urlToFileUrl: (url: string | URL | UrlObject, locale?: string) => {
    pathname: string;
    query: ParsedUrlQuery;
    hash: string | null;
} | {
    hash?: string | undefined;
    pathname: string;
    query: {
        [x: string]: string | string[] | undefined;
    };
} | undefined;
export {};
