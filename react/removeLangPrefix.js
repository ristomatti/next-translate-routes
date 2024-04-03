"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLangPrefix = void 0;
var getPathFromPaths_1 = require("../plugin/getPathFromPaths");
var ntrData_1 = require("../shared/ntrData");
function removeLangPrefix(pathname, toArray, givenLocale) {
    var _a;
    var pathParts = pathname.split('/').filter(Boolean);
    var _b = (0, ntrData_1.getNtrData)(), routesTree = _b.routesTree, defaultLocale = _b.defaultLocale, locales = _b.locales;
    var getLangRoot = function (lang) { return (0, getPathFromPaths_1.getLocalePathFromPaths)({ paths: routesTree.paths, locale: lang }); };
    var defaultLocaleRoot = defaultLocale && getLangRoot(defaultLocale);
    var hasLangPrefix = givenLocale ? pathParts[0] === givenLocale : locales.includes(pathParts[0]);
    var hasDefaultLocalePrefix = !hasLangPrefix && !!defaultLocaleRoot && pathParts[0] === defaultLocaleRoot;
    var hasGivenLocalePrefix = givenLocale ? pathParts[hasLangPrefix ? 1 : 0] === getLangRoot(givenLocale) : false;
    if (!hasLangPrefix && !hasDefaultLocalePrefix && !hasGivenLocalePrefix) {
        return toArray ? pathParts : pathname;
    }
    var locale = givenLocale || hasLangPrefix ? pathParts[0] : defaultLocale;
    var localeRootParts = (locale || hasGivenLocalePrefix) && ((_a = getLangRoot(locale)) === null || _a === void 0 ? void 0 : _a.split('/'));
    var nbPathPartsToRemove = (hasLangPrefix ? 1 : 0) +
        (localeRootParts && (!hasLangPrefix || pathParts[1] === localeRootParts[0]) ? localeRootParts.length : 0);
    return toArray ? pathParts.slice(nbPathPartsToRemove) : "/".concat(pathParts.slice(nbPathPartsToRemove).join('/'));
}
exports.removeLangPrefix = removeLangPrefix;
//# sourceMappingURL=removeLangPrefix.js.map