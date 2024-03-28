/// <reference types="node" />
import { UrlObject } from 'url';
import type { TRouteBranch } from '../types';
/**
 * Recursively get translated path (path-to-regexp syntax) given:
 * - a route branch
 * - file path parts
 * - a locale
 *
 * Ex: Given `/[dynamic]/path` is an existing file path:
 *
 * `/[dynamic]/path` => `/:dynamic/path`
 */
export declare const getTranslatedPathPattern: ({ routeBranch, pathParts, locale, }: {
    routeBranch: TRouteBranch;
    /** Remaining path parts after the `routeBranch` path parts */
    pathParts: string[];
    locale: string;
}) => string;
/**
 * Translate Next file url into translated string url
 *
 * @param url Next default file url
 * @param locale The target locale
 * @param option Options
 * @param option.throwOnError (Default to true) Throw if the input url does not match any page
 *
 * @returns The url string or undefined if no page matched and option.throwOnError is set to false
 * @throws If and the input url does not match any page and option.throwOnError in not set to false
 */
export declare const fileUrlToUrl: (url: UrlObject | URL | string, locale: string, { throwOnError }?: {
    throwOnError?: boolean | undefined;
}) => string | undefined;
