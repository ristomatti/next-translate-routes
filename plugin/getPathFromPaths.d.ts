import type { TRouteSegmentPaths } from '../types';
/**
 * Get the locale path part from a route segment `paths` property and a locale.
 *
 * Ex:
 * ```
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'fr') // 'ici'
 *
 * // If no fallbackLng is defined:
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'pt') // 'here'
 * // If ntrData.fallbackLng.pt === ['es', 'fr'], then:
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'pt') // 'aqui'
 * ```
 */
export declare const getLocalePathFromPaths: <L extends string>({ paths, locale, }: {
    paths: TRouteSegmentPaths<L>;
    locale: L | 'default';
}) => string;
