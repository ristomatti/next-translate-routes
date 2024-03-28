"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNtrData = void 0;
var getPagesPath_1 = require("./getPagesPath");
var parsePages_1 = require("./parsePages");
var createNtrData = function (nextConfig, customPagesPath) {
    var _a = nextConfig, _b = _a.pageExtensions, pageExtensions = _b === void 0 ? ['js', 'ts', 'jsx', 'tsx'] : _b, _c = _a.i18n, defaultLocale = _c.defaultLocale, _d = _c.locales, locales = _d === void 0 ? [] : _d, _e = _c.fallbackLng, fallbackLng = _e === void 0 ? {} : _e, _f = _a.translateRoutes, _g = _f === void 0 ? {} : _f, debug = _g.debug, routesDataFileName = _g.routesDataFileName, customRoutesTree = _g.routesTree, pagesDirectory = _g.pagesDirectory;
    var pagesPath = customPagesPath || (0, getPagesPath_1.getPagesPath)(pagesDirectory);
    var routesTree = customRoutesTree || (0, parsePages_1.parsePages)({ directoryPath: pagesPath, pageExtensions: pageExtensions, routesDataFileName: routesDataFileName });
    // TODO: validateRoutesTree(routesTree)
    return {
        debug: debug,
        defaultLocale: defaultLocale,
        locales: locales,
        routesTree: routesTree,
        fallbackLng: fallbackLng,
    };
};
exports.createNtrData = createNtrData;
//# sourceMappingURL=createNtrData.js.map