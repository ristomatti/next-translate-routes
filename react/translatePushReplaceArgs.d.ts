import { NextRouter, SingletonRouter } from 'next/router';
import type { Url } from '../types';
export declare const translatePushReplaceArgs: ({ router, url, as, locale, }: {
    router: NextRouter | SingletonRouter;
    url: Url;
    as?: Url | undefined;
    locale?: string | false | undefined;
}) => {
    url: Url;
    as: Url;
    locale: string | false | undefined;
} | {
    url: Url;
    as: string | undefined;
    locale: string;
} | {
    url: Url;
    locale: string | false | undefined;
    as?: undefined;
};
