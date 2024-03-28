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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRoutesFiles = exports.getPagesDir = exports.isRoutesFileName = void 0;
var fs_1 = __importDefault(require("fs"));
var find_pages_dir_1 = require("next/dist/lib/find-pages-dir");
var path_1 = __importDefault(require("path"));
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
/** Keep 'routes.json' for backward compatibility */
var DEFAULT_ROUTES_DATA_FILE_NAMES = ['_routes', 'routes'];
var isRoutesFileName = function (fileName, routesDataFileName) {
    var _a;
    var fileNameNoExt = (_a = fileName.match(/^(.+)\.(json|ya?ml)$/)) === null || _a === void 0 ? void 0 : _a[1];
    return (fileNameNoExt &&
        (routesDataFileName ? fileNameNoExt === routesDataFileName : DEFAULT_ROUTES_DATA_FILE_NAMES.includes(fileNameNoExt)));
};
exports.isRoutesFileName = isRoutesFileName;
/**
 * Get pages dir, trying both .pages (next < 13) and .pagesDir (next >= 13) syntaxes
 */
var getPagesDir = function () {
    var pagesDirs = (0, find_pages_dir_1.findPagesDir)(process.cwd());
    var pagesDir = typeof pagesDirs === 'object'
        ? pagesDirs.pages || pagesDirs.pagesDir
        : pagesDirs;
    if (!pagesDir) {
        throw new Error(withNtrPrefix_1.ntrMessagePrefix +
            '`/pages` directory not found.' +
            (pagesDirs.appDir ? ' next-translate-routes does not support `/app` directory yet.' : ''));
    }
    return pagesDir;
};
exports.getPagesDir = getPagesDir;
var getAllRoutesFiles = function (directoryPath, routesDataFileName) {
    if (directoryPath === void 0) { directoryPath = (0, exports.getPagesDir)(); }
    var directoryItems = fs_1.default.readdirSync(directoryPath);
    return directoryItems.reduce(function (acc, directoryItem) {
        var itemPath = path_1.default.join(directoryPath, directoryItem);
        if (fs_1.default.statSync(itemPath).isDirectory()) {
            return __spreadArray(__spreadArray([], __read(acc), false), __read((0, exports.getAllRoutesFiles)(itemPath, routesDataFileName)), false);
        }
        if ((0, exports.isRoutesFileName)(directoryItem, routesDataFileName)) {
            return __spreadArray(__spreadArray([], __read(acc), false), [itemPath], false);
        }
        return acc;
    }, []);
};
exports.getAllRoutesFiles = getAllRoutesFiles;
//# sourceMappingURL=routesFiles.js.map