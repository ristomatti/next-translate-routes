type TMinorPatch = `.${number}`;
type TVersion = `${number}` | `${number}${TMinorPatch}` | `${number}${TMinorPatch}${TMinorPatch}`;
export declare const checkNextVersion: (version: `${'<' | '>' | '=' | '>=' | '<=' | '!='}${TVersion}`, fallback?: boolean) => boolean;
export {};
