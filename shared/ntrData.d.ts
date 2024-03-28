import type { TNtrData } from '../types';
export declare const setNtrData: (ntrData: TNtrData) => void;
export declare const getNtrData: <L extends string = string>() => TNtrData<L>;
