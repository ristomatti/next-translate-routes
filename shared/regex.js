"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicFilepathPartsRegex = exports.getDynamicPathPartKey = exports.dynamicFilepathPartRegex = exports.getSpreadFilepathPartKey = exports.spreadFilepathPartRegex = exports.matchAllFilepathPartsRegex = exports.optionalMatchAllFilepathPartRegex = exports.anyDynamicPathPatternPartRegex = exports.anyDynamicFilepathPartsRegex = exports.anyDynamicFilepathPartRegex = exports.ignoreSegmentPathRegex = void 0;
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
exports.ignoreSegmentPathRegex = /^\.(\(.+\))?$/;
/**
 * Ex: `[slug]` or `[...pathParts]` or `[[...pathParts]]`
 */
exports.anyDynamicFilepathPartRegex = /^\[\[?(?:\.{3})?([^/[\]?#]+)\]?\]$/;
/**
 * Match all dynamic parts: `[slug]` and `[...pathParts]` and `[[...pathParts]]`
 */
exports.anyDynamicFilepathPartsRegex = /\[\[?(?:\.{3})?([^/[\]?#]+)\]?\]/g;
/**
 * Ex: `:slug` or `:pathParts*` or `:pathParts+` or `foo-:bar`
 */
exports.anyDynamicPathPatternPartRegex = /(?:^|[^\\]):[\d\w]+/;
/**
 * Ex: `[[...pathParts]]`
 */
exports.optionalMatchAllFilepathPartRegex = /^\[\[\.{3}([^/[\]?#]+)\]\]$/;
/**
 * Match all `[...pathParts]` parts but not `[[...pathParts]]` parts
 */
exports.matchAllFilepathPartsRegex = /\[\.{3}([^/[\]?#]+)\]/g;
/**
 * A "spread path part" is either a match-all path part (`[...pathParts]`),
 * either an optional match all path part (`[[...pathParts]]`)
 */
exports.spreadFilepathPartRegex = /^\[\[?\.{3}([^/[\]?#]+)\]?\]$/;
/** Ex: `'[...pathParts]'` => `'pathParts'` and `'[[...pathParts]]'` => `pathParts` but `'[slug]'` => `null` and `'pathPart'` => `null` */
var getSpreadFilepathPartKey = function (pathPart) { var _a; return ((_a = exports.spreadFilepathPartRegex.exec(pathPart)) === null || _a === void 0 ? void 0 : _a[1]) || null; };
exports.getSpreadFilepathPartKey = getSpreadFilepathPartKey;
/**
 * Ex: `[slug]` and neither `[...pathParts]` nor `[[...pathParts]]`
 */
exports.dynamicFilepathPartRegex = /^\[(?!\.{3})([^/[\]?#]*)\]$/;
/** Ex: `'[slug]'` => `'slug'` but `'[...pathParts]'` => `null` and '`pathPart'` => `null` */
var getDynamicPathPartKey = function (pathPart) { var _a; return ((_a = exports.dynamicFilepathPartRegex.exec(pathPart)) === null || _a === void 0 ? void 0 : _a[1]) || null; };
exports.getDynamicPathPartKey = getDynamicPathPartKey;
/**
 * Match all `[slug]` parts but neither `[...pathParts]` parts nor `[[...pathParts]]` parts
 */
exports.dynamicFilepathPartsRegex = /\[(?!\.{3})([^/[\]?#]*)\]/g;
//# sourceMappingURL=regex.js.map