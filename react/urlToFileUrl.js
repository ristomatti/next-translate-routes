"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlToFileUrl = exports.parsePathParts = void 0;
var path_to_regexp_1 = require("path-to-regexp");
var getPathFromPaths_1 = require("../plugin/getPathFromPaths");
var ntrData_1 = require("../shared/ntrData");
var regex_1 = require("../shared/regex");
var parseUrl_1 = require("./parseUrl");
var removeLangPrefix_1 = require("./removeLangPrefix");
var MATCH_TYPE;
(function (MATCH_TYPE) {
    MATCH_TYPE["STATIC"] = "static";
    MATCH_TYPE["DYNAMIC"] = "dynamic";
    MATCH_TYPE["MATCHALL"] = "match-all";
})(MATCH_TYPE || (MATCH_TYPE = {}));
var getEndFilepathParts = function (_a, locale) {
    var e_1, _b, _c;
    var _d;
    var _e = _a.children, children = _e === void 0 ? [] : _e;
    try {
        for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            var path = (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: child.paths, locale: locale });
            if (path === 'index') {
                return { parsedPathParts: [], additionalQuery: {}, firstMatchType: MATCH_TYPE.STATIC };
            }
            if (regex_1.ignoreSegmentPathRegex.test(path) && ((_d = child.children) === null || _d === void 0 ? void 0 : _d.length)) {
                var descendantResult = getEndFilepathParts(child, locale);
                if (descendantResult) {
                    return __assign(__assign({}, descendantResult), { parsedPathParts: __spreadArray([child.name], __read(descendantResult.parsedPathParts), false) });
                }
            }
            var optionalMatchAllToken = (0, path_to_regexp_1.parse)(path).find(function (ptrToken) { return typeof ptrToken === 'object' && ptrToken.modifier === '*'; });
            if (optionalMatchAllToken) {
                return {
                    parsedPathParts: [child.name],
                    additionalQuery: (_c = {}, _c[optionalMatchAllToken.name] = [], _c),
                    firstMatchType: MATCH_TYPE.MATCHALL,
                };
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_b = children_1.return)) _b.call(children_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return undefined;
};
/**
 * Recursively parse paths to identify the matching file path, and extract the parameters
 *
 * We must do this taking care of the priorities:
 * 1. static match among the current route branch children
 * 2. static match among among the descendants of a child that is path-ignored
 * 3. dynamic match among the current route branch children
 * 4. dynamic match among among the descendants of a child that is path-ignored
 * 5. match all match among the current route branch children
 * 6. match all match among among the descendants of a child that is path-ignored
 */
var parsePathParts = function (_a) {
    var e_2, _b, e_3, _c;
    var locale = _a.locale, _d = _a.pathParts, pathParts = _d === void 0 ? [] : _d, routeBranch = _a.routeBranch;
    var children = routeBranch.children;
    // If there is no path parts left to parse
    if (pathParts.length === 0) {
        if (!(children === null || children === void 0 ? void 0 : children.length)) {
            // The current routeBranch have no children, this is a match
            return { parsedPathParts: [], additionalQuery: {}, firstMatchType: MATCH_TYPE.STATIC };
        }
        return getEndFilepathParts(routeBranch, locale);
    }
    var currentPathPart = pathParts[0];
    var nextPathParts = pathParts.slice(1);
    // Ignore empty path parts
    if (!currentPathPart) {
        return (0, exports.parsePathParts)({ locale: locale, pathParts: nextPathParts, routeBranch: routeBranch });
    }
    // We are looking for the route matching the current path part among ther routeBranch children
    // It can be a static path part, or a dynamic path part (`[slug]` or `[...path]` for exemple)
    if (!(children === null || children === void 0 ? void 0 : children.length)) {
        // No match possible
        return undefined;
    }
    // 1. Lets first look for static matches among the current children
    /** We will store here candidates that does not match statically */
    var delayedCandidates = [];
    var matchAllCandidate = undefined;
    try {
        for (var children_2 = __values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
            var candidate = children_2_1.value;
            var path = (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: candidate.paths, locale: locale });
            // Does the candidate statically match?
            if (path === currentPathPart) {
                // It does! But does its children match too?
                var childrenParsedPathParts = (0, exports.parsePathParts)({ locale: locale, pathParts: nextPathParts, routeBranch: candidate });
                if (childrenParsedPathParts) {
                    // They do! Let's return the result immediately
                    return __assign(__assign({}, childrenParsedPathParts), { parsedPathParts: __spreadArray([candidate.name], __read(childrenParsedPathParts.parsedPathParts), false), firstMatchType: MATCH_TYPE.STATIC });
                }
            }
            var isAnyDynamicPathPattern = regex_1.anyDynamicPathPatternPartRegex.test(path);
            var isIgnorePathPattern = regex_1.ignoreSegmentPathRegex.test(path);
            // Does the candidate path is static even if it does not match?
            if (!isAnyDynamicPathPattern && !isIgnorePathPattern) {
                // This candidate is static and does not match the currentPathPart: no need to check further
                continue;
            }
            // So this candidate is not static
            // Let's classify it to use it later and first look for a static match (priority):
            // is it path-ignored, dynamic, or match-all?
            if (isIgnorePathPattern) {
                // It is path-ignored, let's unshift (hight priority) it among the delayedCandidates
                delayedCandidates.unshift({ candidate: candidate, isPathIgnored: true });
                continue;
            }
            else if ((0, path_to_regexp_1.parse)(path).some(function (ptrToken) { return typeof ptrToken === 'object' && ['+', '*'].includes(ptrToken.modifier); })) {
                // It is a match-all path: let's store it alone (there can be only one)
                matchAllCandidate = candidate;
            }
            else {
                // It is a dynamic path, let's push (low priority) it among the delayedCandidates
                delayedCandidates.push({ candidate: candidate, isPathIgnored: false });
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (children_2_1 && !children_2_1.done && (_b = children_2.return)) _b.call(children_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    // Now we know that there is no static match among these children
    // 2. & 3.Let's take care of these delayed candidates
    /**
     * We will store here the non static matches from path-ignored candidates
     * to handle them if there is not dynamic match among the current children
     */
    var pathIgnoredResults = {};
    try {
        for (var delayedCandidates_1 = __values(delayedCandidates), delayedCandidates_1_1 = delayedCandidates_1.next(); !delayedCandidates_1_1.done; delayedCandidates_1_1 = delayedCandidates_1.next()) {
            var _e = delayedCandidates_1_1.value, candidate = _e.candidate, isPathIgnored = _e.isPathIgnored;
            if (isPathIgnored) {
                // 2. Let's look among the descendants of this path-ignored candidate
                var rawResult = (0, exports.parsePathParts)({
                    locale: locale,
                    routeBranch: candidate,
                    pathParts: pathParts,
                });
                if (rawResult) {
                    // Found a match
                    var result = __assign(__assign({}, rawResult), { parsedPathParts: __spreadArray([candidate.name], __read(rawResult.parsedPathParts), false) });
                    if (rawResult.firstMatchType === MATCH_TYPE.STATIC) {
                        // Static match: that's it, let's take this one
                        return result;
                    }
                    else {
                        // Let's store it for now, we will use it if we don't find something better
                        pathIgnoredResults[rawResult.firstMatchType] = result;
                    }
                }
            }
            else {
                // 3. If we are here, it means that we did not find any static match, even among path-ignored candidates descendants,
                // because we sorted the candidates in the delayedCandidates array: first the path-ignored candidates, then the dynamic ones.
                var path = (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: candidate.paths, locale: locale });
                var match = (0, path_to_regexp_1.match)(path)(currentPathPart);
                if (match) {
                    // It matches! But does its children match too?
                    var childrenParsedPathParts = (0, exports.parsePathParts)({ locale: locale, pathParts: nextPathParts, routeBranch: candidate });
                    if (childrenParsedPathParts) {
                        // They do! Let's return the result immediately
                        return {
                            parsedPathParts: __spreadArray([candidate.name], __read(childrenParsedPathParts.parsedPathParts), false),
                            additionalQuery: __assign(__assign({}, childrenParsedPathParts.additionalQuery), match.params),
                            firstMatchType: MATCH_TYPE.DYNAMIC,
                        };
                    }
                }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (delayedCandidates_1_1 && !delayedCandidates_1_1.done && (_c = delayedCandidates_1.return)) _c.call(delayedCandidates_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    // 4. Do we have a dynamic match stored in the pathIgnoredMatches?
    if (pathIgnoredResults[MATCH_TYPE.DYNAMIC]) {
        // Yes, let's return it
        return pathIgnoredResults[MATCH_TYPE.DYNAMIC];
    }
    // 5. Do we have a matchAllCandidate stored?
    if (matchAllCandidate) {
        // Yes.
        var path = (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: matchAllCandidate.paths, locale: locale });
        var match = (0, path_to_regexp_1.match)('/' + path)('/' + pathParts.join('/'));
        if (match) {
            // It matches! And it does not have children (or should not).
            return {
                parsedPathParts: [matchAllCandidate.name],
                additionalQuery: match.params,
                firstMatchType: MATCH_TYPE.MATCHALL,
            };
        }
    }
    // 6. Do we have a match all match stored in the pathIgnoredMatches?
    if (pathIgnoredResults[MATCH_TYPE.DYNAMIC]) {
        // Yes, let's return it
        return pathIgnoredResults[MATCH_TYPE.DYNAMIC];
    }
    // Still there? No match then.
    return undefined;
};
exports.parsePathParts = parsePathParts;
/**
 * Parse a translated url to get the corresponding file url (UrlObject)
 *
 * Ex: `urlToFileUrl('/fr/mon/url/de/france', 'fr')` => `{ pathname: '/my/url/from/[country], query: { country: 'france' } }`
 *
 * @param url The url to parse: can be a string, an URL or an UrlObject
 * @param locale (optional) The locale corresponding to the url translation.
 * If omitted, urlToFileUrl will look for the locale in the first path part.
 * If it does not match a locale, urlToFileUrl will use the default locale.
 *
 * @returns The file path based, Next.js format, url in UrlObject format
 * if the url successfully matched a file path, and undefined otherwise
 */
var urlToFileUrl = function (url, locale) {
    var _a = (0, ntrData_1.getNtrData)(), routesTree = _a.routesTree, defaultLocale = _a.defaultLocale, locales = _a.locales;
    var _b = (0, parseUrl_1.parseUrl)(url), pathname = _b.pathname, query = _b.query, hash = _b.hash;
    if (pathname && regex_1.anyDynamicFilepathPartsRegex.exec(pathname)) {
        // The given url seems to already be a fileUrl, return it as is.
        // Not sure if we should return undefined instead. Or throw?
        return { pathname: pathname, query: query, hash: hash };
    }
    var result = (0, exports.parsePathParts)({
        locale: locale || defaultLocale || locales[0],
        routeBranch: routesTree,
        pathParts: (0, removeLangPrefix_1.removeLangPrefix)(pathname || '/', true, locale),
    });
    if (result) {
        var parsedPathParts = result.parsedPathParts, additionalQuery = result.additionalQuery;
        return __assign({ pathname: "/".concat(parsedPathParts.join('/')), query: __assign(__assign({}, query), additionalQuery) }, (hash && { hash: hash }));
    }
    return undefined;
};
exports.urlToFileUrl = urlToFileUrl;
//# sourceMappingURL=urlToFileUrl.js.map