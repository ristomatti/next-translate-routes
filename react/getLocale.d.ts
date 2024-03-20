import { NextRouter, SingletonRouter } from 'next/router';
export declare const getLocale: ({ locale, defaultLocale, locales }: NextRouter | SingletonRouter, explicitLocale?: string | false) => string;
