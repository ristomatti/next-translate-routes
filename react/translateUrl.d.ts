/// <reference types="node" />
import { UrlObject } from 'url';
import type { Url } from '../types';
type Options<F extends 'string' | 'object' = 'string' | 'object'> = {
    format?: F;
    withoutLangPrefix?: boolean;
};
/**
 * Translate path into locale
 *
 * @param url string url or UrlObject
 * @param locale string
 * @param options (optional)
 * @param options.format `'string'` or `'object'`
 * @return string if `options.format === 'string'`,
 * UrlObject if `options.format === 'object'`,
 * same type as url if options.format is not defined
 */
export declare function translatePath<U extends string | UrlObject, F extends 'string' | 'object'>(url: U, locale: string, options?: Options<F>): 'string' | 'object' extends F ? U extends string ? string : U extends UrlObject ? UrlObject : Url : F extends 'string' ? string : UrlObject;
export type TTranslateUrl = typeof translatePath;
/**
 * Translate url into locale
 *
 * Will soon be deprecated in favor of fileUrlToUrl and urlToFileUrl
 *
 * @param url string url or UrlObject
 * @param locale string
 * @param options (optional)
 * @param options.format `'string'` or `'object'`
 * @return string if `options.format === 'string'`,
 * UrlObject if `options.format === 'object'`,
 * same type as url if options.format is not defined
 */
export declare const translateUrl: TTranslateUrl;
export {};
