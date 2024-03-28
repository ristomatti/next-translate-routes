"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileNameToPath = void 0;
var regex_1 = require("../shared/regex");
/** Transform Next file-system syntax to path-to-regexp syntax */
var fileNameToPath = function (fileName) {
    return fileName
        .replace(regex_1.optionalMatchAllFilepathPartRegex, ':$1*') // [[...param]]
        .replace(regex_1.matchAllFilepathPartsRegex, ':$1+') // [...param]
        .replace(regex_1.dynamicFilepathPartsRegex, ':$1');
}; // [param]
exports.fileNameToPath = fileNameToPath;
//# sourceMappingURL=fileNameToPaths.js.map