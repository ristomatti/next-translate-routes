/**
 * A segment can be ignored by setting its path to `"."` in _routes.json.
 * It can be done for some lang only and not others.
 *
 * ⚠️ It can cause troubles with the **redirections**.
 *
 * Ex: given the `/a/[b]/[c]` and `/a/[b]/[c]/d` file paths where `[b]` is ignored and the b param is merged with the c param: `:b-:c`.
 * `/a/:b/:c` => `/a/:b-:c` and `/a/:b/:c/d` => `/a/:b-:c/d`
 * Then `/a/bb/11` will be redirected to `/a/bb-11` and `/a/bb/11/d` to `/a/bb-11/d` and that is fine.
 * But then `/a/bb-11/d` will match `/a/:b-:c` and be redirected to `/a/bb-11-d` and that is not fine!
 *
 * To handle this case, one can add a path-to-regex pattern to the default ignore token. Ex: `.(\\d+)`, or `.(\[\^-\]+)`, or `.(\what|ever\)`.
 * This path-to-regex pattern will be added after the segment name in the redirect.
 * `/a/:b(\[\^-\]+)/:c` => `/a/:b-:c` and `/a/:b(\[\^-\]+)/:c/d` => `/a/:b-:c/d`
 * Then `/a/bb-11/d` will no more match `/a/[b]/[c]` (`/a/:b(\[\^-\]+)/:c`).
 *
 * ⚠️ This is only handled in default paths (i.e. `"/": ".(\\d+)"` or `"/": { "default": ".(\\d+)" }`), not in lang-specific paths.
 *
 * #ignorePattern
 */
export declare const ignoreSegmentPathRegex: RegExp;
/**
 * Ex: `[slug]` or `[...pathParts]` or `[[...pathParts]]`
 */
export declare const anyDynamicFilepathPartRegex: RegExp;
/**
 * Match all dynamic parts: `[slug]` and `[...pathParts]` and `[[...pathParts]]`
 */
export declare const anyDynamicFilepathPartsRegex: RegExp;
/**
 * Ex: `:slug` or `:pathParts*` or `:pathParts+` or `foo-:bar`
 */
export declare const anyDynamicPathPatternPartRegex: RegExp;
/**
 * Ex: `[[...pathParts]]`
 */
export declare const optionalMatchAllFilepathPartRegex: RegExp;
/**
 * Match all `[...pathParts]` parts but not `[[...pathParts]]` parts
 */
export declare const matchAllFilepathPartsRegex: RegExp;
/**
 * A "spread path part" is either a match-all path part (`[...pathParts]`),
 * either an optional match all path part (`[[...pathParts]]`)
 */
export declare const spreadFilepathPartRegex: RegExp;
/** Ex: `'[...pathParts]'` => `'pathParts'` and `'[[...pathParts]]'` => `pathParts` but `'[slug]'` => `null` and `'pathPart'` => `null` */
export declare const getSpreadFilepathPartKey: (pathPart: string) => string | null;
/**
 * Ex: `[slug]` and neither `[...pathParts]` nor `[[...pathParts]]`
 */
export declare const dynamicFilepathPartRegex: RegExp;
/** Ex: `'[slug]'` => `'slug'` but `'[...pathParts]'` => `null` and '`pathPart'` => `null` */
export declare const getDynamicPathPartKey: (pathPart: string) => string | null;
/**
 * Match all `[slug]` parts but neither `[...pathParts]` parts nor `[[...pathParts]]` parts
 */
export declare const dynamicFilepathPartsRegex: RegExp;
