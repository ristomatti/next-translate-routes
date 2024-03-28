/// <reference types="node" />
import type { UrlObject } from 'url';
/**
 * Get the file UrlObject matching a string file url
 *
 * Ex: Given `/[dynamic]/path` is an existing file path,
 *
 * `/value/path?foo=bar` => { pathname: `/[dynamic]/path`, query: { dynamic: 'value', foo: 'bar' } }
 *
 * @throws if the fileUrl input does not match any page
 */
export declare const fileUrlToFileUrlObject: (fileUrl: string | UrlObject | URL) => {
    auth: string | null;
    hash: string | null;
    host: string | null;
    hostname: string | null;
    href: string;
    path: string | null;
    protocol: string | null;
    search: string | null;
    slashes: boolean | null;
    port: string | null;
    pathname: string;
    query: {
        [x: string]: string | string[] | undefined;
    };
};
