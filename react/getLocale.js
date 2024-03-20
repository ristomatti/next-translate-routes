"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocale = void 0;
var ntrData_1 = require("../shared/ntrData");
var getLocale = function (_a, explicitLocale) {
    var locale = _a.locale, defaultLocale = _a.defaultLocale, locales = _a.locales;
    return explicitLocale || locale || defaultLocale || (locales === null || locales === void 0 ? void 0 : locales[0]) || (0, ntrData_1.getNtrData)().defaultLocale || (0, ntrData_1.getNtrData)().locales[0];
};
exports.getLocale = getLocale;
//# sourceMappingURL=getLocale.js.map