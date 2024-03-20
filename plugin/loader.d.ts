import type { TNtrData } from '../types';
export declare function loader(this: {
    query: {
        mustMatch?: boolean;
        data: TNtrData;
    };
    resourcePath: string;
}, rawCode: string): string;
