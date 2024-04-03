"use strict";
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
exports.getLocalePathFromPaths = void 0;
var ntrData_1 = require("../shared/ntrData");
var getFallbackLngs = function (lng) {
    var fallbackLng = ((0, ntrData_1.getNtrData)() || {}).fallbackLng;
    if (!fallbackLng) {
        return undefined;
    }
    if (typeof fallbackLng === 'string') {
        return [fallbackLng];
    }
    return Array.isArray(fallbackLng) ? fallbackLng : fallbackLng[lng];
};
/**
 * Get the locale path part from a route segment `paths` property and a locale.
 *
 * Ex:
 * ```
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'fr') // 'ici'
 *
 * // If no fallbackLng is defined:
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'pt') // 'here'
 * // If ntrData.fallbackLng.pt === ['es', 'fr'], then:
 * getPathFromPaths({ default: 'here', fr: 'ici', es: 'aqui' }, 'pt') // 'aqui'
 * ```
 */
var getLocalePathFromPaths = function (_a) {
    var e_1, _b;
    var paths = _a.paths, locale = _a.locale;
    if (paths[locale]) {
        return paths[locale];
    }
    var fallbackLngs = getFallbackLngs(locale);
    if (fallbackLngs) {
        try {
            for (var fallbackLngs_1 = __values(fallbackLngs), fallbackLngs_1_1 = fallbackLngs_1.next(); !fallbackLngs_1_1.done; fallbackLngs_1_1 = fallbackLngs_1.next()) {
                var l = fallbackLngs_1_1.value;
                if (paths[l]) {
                    return paths[l];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (fallbackLngs_1_1 && !fallbackLngs_1_1.done && (_b = fallbackLngs_1.return)) _b.call(fallbackLngs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return paths.default;
};
exports.getLocalePathFromPaths = getLocalePathFromPaths;
//# sourceMappingURL=getPathFromPaths.js.map