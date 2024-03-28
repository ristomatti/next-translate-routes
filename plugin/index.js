"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNtrData = exports.withTranslateRoutes = void 0;
var createNtrData_1 = require("./createNtrData");
Object.defineProperty(exports, "createNtrData", { enumerable: true, get: function () { return createNtrData_1.createNtrData; } });
var withTranslateRoutes_1 = require("./withTranslateRoutes");
Object.defineProperty(exports, "withTranslateRoutes", { enumerable: true, get: function () { return withTranslateRoutes_1.withTranslateRoutes; } });
module.exports = Object.assign(withTranslateRoutes_1.withTranslateRoutes, { withTranslateRoutes: withTranslateRoutes_1.withTranslateRoutes, createNtrData: createNtrData_1.createNtrData });
exports.default = withTranslateRoutes_1.withTranslateRoutes;
//# sourceMappingURL=index.js.map