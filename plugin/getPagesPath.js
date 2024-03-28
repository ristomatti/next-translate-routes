"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagesPath = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
var getPagesPath = function (pagesDirectory) {
    var pagesDir = ['pages', 'src/pages', 'app/pages', 'integrations/pages', pagesDirectory].find(function (dirPath) { return dirPath && fs_1.default.existsSync(path_1.default.join(process.cwd(), dirPath)); });
    if (!pagesDir) {
        throw new Error(withNtrPrefix_1.ntrMessagePrefix + 'No pages folder found.');
    }
    return path_1.default.join(process.cwd(), pagesDir, '/');
};
exports.getPagesPath = getPagesPath;
//# sourceMappingURL=getPagesPath.js.map