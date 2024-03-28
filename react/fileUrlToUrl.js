"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUrlToUrl = exports.getTranslatedPathPattern = void 0;
var normalize_trailing_slash_1 = require("next/dist/client/normalize-trailing-slash");
var path_to_regexp_1 = require("path-to-regexp");
var url_1 = require("url");
var getPathFromPaths_1 = require("../plugin/getPathFromPaths");
var ntrData_1 = require("../shared/ntrData");
var regex_1 = require("../shared/regex");
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
var fileUrlToFileUrlObject_1 = require("./fileUrlToFileUrlObject");
/**
 * Get pattern from route branch paths property in the specified locale,
 * or, if it does not exist, the default path.
 */
var getPatternFromRoutePaths = function (routeBranch, locale) {
    var pattern = (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: routeBranch.paths, locale: locale });
    return regex_1.ignoreSegmentPathRegex.test(pattern) ? '' : pattern;
};
/** Add `/` prefix only if `pattern` is not an empty string and does not already have it */
var addSlashPrefix = function (path) { return (path === '' || path.startsWith('/') ? path : "/".concat(path)); };
/** Get the translated path of a route branch (handling ignored path parts, index, match all, etc.) */
var getTranslatedPathPart = function (_a) {
    var _b;
    var routeBranch = _a.routeBranch, locale = _a.locale, isLastPathPart = _a.isLastPathPart;
    var pattern = getPatternFromRoutePaths(routeBranch, locale);
    if (isLastPathPart) {
        if ((_b = routeBranch.children) === null || _b === void 0 ? void 0 : _b.length) {
            var silentChild = routeBranch.children.find(function (child) { var _a; return !((_a = child.children) === null || _a === void 0 ? void 0 : _a.length) && (child.name === 'index' || regex_1.optionalMatchAllFilepathPartRegex.test(child.name)); });
            if (!silentChild) {
                throw new Error("No index file found in \"".concat(routeBranch.name, "\" folder."));
            }
            var indexChildPattern = getPatternFromRoutePaths(silentChild, locale);
            if (indexChildPattern && indexChildPattern !== 'index') {
                pattern = pattern + addSlashPrefix(indexChildPattern);
            }
        }
        else if (pattern === 'index' && routeBranch.name === 'index') {
            pattern = '';
        }
    }
    return addSlashPrefix(pattern);
};
/**
 * Recursively get translated path (path-to-regexp syntax) given:
 * - a route branch
 * - file path parts
 * - a locale
 *
 * Ex: Given `/[dynamic]/path` is an existing file path:
 *
 * `/[dynamic]/path` => `/:dynamic/path`
 */
var getTranslatedPathPattern = function (_a) {
    var _b;
    var routeBranch = _a.routeBranch, pathParts = _a.pathParts, locale = _a.locale;
    var isLastPathPart = pathParts.length === 0;
    /** Current part path pattern */
    var currentTranslatedPathPart = getTranslatedPathPart({ routeBranch: routeBranch, locale: locale, isLastPathPart: isLastPathPart });
    if (isLastPathPart) {
        return currentTranslatedPathPart;
    }
    var _c = __read(pathParts), nextFilePathPart = _c[0], remainingFilePathParts = _c.slice(1);
    // Next parts path patterns: looking for the child corresponding to nextPathPart:
    // if nextPathPart does not match any child name and a dynamic child is found,
    // we will consider that nextPathPart is a value given to the dynamic child
    var matchingChild = (_b = routeBranch.children) === null || _b === void 0 ? void 0 : _b.find(function (child) { return child.name === nextFilePathPart; });
    if (!matchingChild) {
        throw new Error("".concat(nextFilePathPart, " not found in ").concat(routeBranch.name || 'pages'));
    }
    var remainingTranslatedPath = (0, exports.getTranslatedPathPattern)({
        routeBranch: matchingChild,
        pathParts: remainingFilePathParts,
        locale: locale,
    });
    return currentTranslatedPathPart + remainingTranslatedPath;
};
exports.getTranslatedPathPattern = getTranslatedPathPattern;
/**
 * Translate Next file url into translated string url
 *
 * @param url Next default file url
 * @param locale The target locale
 * @param option Options
 * @param option.throwOnError (Default to true) Throw if the input url does not match any page
 *
 * @returns The url string or undefined if no page matched and option.throwOnError is set to false
 * @throws If and the input url does not match any page and option.throwOnError in not set to false
 */
var fileUrlToUrl = function (url, locale, _a) {
    var e_1, _b;
    var _c = _a === void 0 ? {} : _a, _d = _c.throwOnError, throwOnError = _d === void 0 ? true : _d;
    try {
        var _e = (0, fileUrlToFileUrlObject_1.fileUrlToFileUrlObject)(url), pathname = _e.pathname, query = _e.query, hash = _e.hash;
        var _f = (0, ntrData_1.getNtrData)(), routesTree = _f.routesTree, defaultLocale = _f.defaultLocale;
        var pathParts = (pathname || '/')
            .replace(/^\/|\/$/g, '')
            .split('/')
            .filter(Boolean);
        var pathPattern = (0, exports.getTranslatedPathPattern)({ routeBranch: routesTree, pathParts: pathParts, locale: locale });
        var newPathname = (0, normalize_trailing_slash_1.normalizePathTrailingSlash)((0, path_to_regexp_1.compile)(pathPattern)(query));
        try {
            for (var _g = __values((0, path_to_regexp_1.parse)(pathPattern)), _h = _g.next(); !_h.done; _h = _g.next()) {
                var patternToken = _h.value;
                if (typeof patternToken === 'object' && patternToken.name) {
                    delete query[patternToken.name];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return "".concat(locale !== defaultLocale ? "/".concat(locale) : '').concat((0, url_1.format)({
            pathname: newPathname,
            query: query,
            hash: hash,
        }));
    }
    catch (cause) {
        if (throwOnError) {
            throw new Error(withNtrPrefix_1.ntrMessagePrefix + "No page found for the following file url: ".concat(url.toString()), { cause: cause });
        }
        return undefined;
    }
};
exports.fileUrlToUrl = fileUrlToUrl;
//# sourceMappingURL=fileUrlToUrl.js.map