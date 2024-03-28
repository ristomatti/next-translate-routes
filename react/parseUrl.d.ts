/// <reference types="node" />
import { UrlObject, UrlWithParsedQuery } from 'url';
/** Parse an url and its query to object */
export declare const parseUrl: (url: UrlObject | URL | string) => UrlWithParsedQuery;
