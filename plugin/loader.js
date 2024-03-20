"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
function loader(rawCode) {
    var _this = this;
    var _a;
    var uncommentedCode = rawCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    var defaultExportHocMatch = uncommentedCode.match(/^\s*import (\w+).* from ["']next-translate-routes["']/m);
    var namedExportHocMatch = uncommentedCode.match(/^\s*import .*\{.*withTranslateRoutes(?: as (\w+))?\W?.*\} from ["']next-translate-routes["']/m);
    var defaultExportHocName = defaultExportHocMatch === null || defaultExportHocMatch === void 0 ? void 0 : defaultExportHocMatch[1];
    var namedExportHocName = namedExportHocMatch ? namedExportHocMatch[1] || 'withTranslateRoutes' : null;
    if (!defaultExportHocName && !namedExportHocName) {
        if ((_a = this.query.mustMatch) !== null && _a !== void 0 ? _a : true) {
            throw new Error(withNtrPrefix_1.ntrMessagePrefix + "No withTranslateRoutes high order component found in ".concat(this.resourcePath, "."));
        }
        else {
            return rawCode;
        }
    }
    var result = rawCode;
    [defaultExportHocName, namedExportHocName].forEach(function (name) {
        if (name) {
            result = rawCode.replace(new RegExp("(".concat(name, "\\()"), 'g'), "$1JSON.parse(`".concat(JSON.stringify(_this.query.data, function (_key, value) {
                return typeof value === 'string' ? value.replace('\\', '\\\\') : value;
            }), "`), "));
        }
    });
    return result;
}
exports.loader = loader;
//# sourceMappingURL=loader.js.map