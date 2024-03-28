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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePages = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var yamljs_1 = __importDefault(require("yamljs"));
var regex_1 = require("../shared/regex");
var fileNameToPaths_1 = require("./fileNameToPaths");
var routesFiles_1 = require("./routesFiles");
/** Get path and path translations from name and all translations #childrenOrder */
var getRouteSegment = function (name, routeSegmentsData, isDirectory) {
    var routeSegmentData = routeSegmentsData === null || routeSegmentsData === void 0 ? void 0 : routeSegmentsData[isDirectory ? '/' : name];
    var _a = typeof routeSegmentData === 'object' ? routeSegmentData : { default: routeSegmentData }, _b = _a.default, defaultPath = _b === void 0 ? (0, fileNameToPaths_1.fileNameToPath)(name) : _b, localized = __rest(_a, ["default"]);
    var paths = __assign({ default: defaultPath }, localized);
    return {
        name: name,
        paths: paths,
    };
};
/** Attribute a weight to a route branch so that they can be sorted: the heaviest must be the last */
var getOrderWeight = function (_a) {
    var name = _a.name, children = _a.children;
    var weight = 0;
    [regex_1.spreadFilepathPartRegex.test(name), regex_1.anyDynamicFilepathPartRegex.test(name), children === null || children === void 0 ? void 0 : children.length].forEach(function (condition) {
        if (condition) {
            weight++;
        }
    });
    return weight;
};
/**
 * Recursively parse pages directory and build a page tree object
 */
var parsePages = function (_a) {
    var propDirectoryPath = _a.directoryPath, pageExtensions = _a.pageExtensions, isSubBranch = _a.isSubBranch, routesDataFileName = _a.routesDataFileName;
    var directoryPath = propDirectoryPath || (0, routesFiles_1.getPagesDir)();
    var directoryItems = fs_1.default.readdirSync(directoryPath);
    var routesFileName = directoryItems.find(function (directoryItem) { return (0, routesFiles_1.isRoutesFileName)(directoryItem, routesDataFileName); });
    var routeSegmentsFileContent = routesFileName
        ? fs_1.default.readFileSync(path_1.default.join(directoryPath, routesFileName), { encoding: 'utf8' })
        : '';
    var routeSegmentsData = (routeSegmentsFileContent
        ? (/\.ya?ml$/.test(routesFileName) ? yamljs_1.default : JSON).parse(routeSegmentsFileContent)
        : {});
    var directoryPathParts = directoryPath.replace(/[\\/]/, '').split(/[\\/]/);
    var name = isSubBranch ? directoryPathParts[directoryPathParts.length - 1] : '';
    var children = directoryItems
        .reduce(function (acc, item) {
        var isDirectory = fs_1.default.statSync(path_1.default.join(directoryPath, item)).isDirectory();
        var pageMatch = item.match(new RegExp("(.+)\\.(".concat(pageExtensions.join('|'), ")$")));
        var pageName = (!isDirectory && (pageMatch === null || pageMatch === void 0 ? void 0 : pageMatch[1])) || '';
        if (!isSubBranch && (['_app', '_document', '_error', '404', '500'].includes(pageName) || item === 'api')) {
            return acc;
        }
        if (isDirectory || pageName) {
            return __spreadArray(__spreadArray([], __read(acc), false), [
                isDirectory
                    ? (0, exports.parsePages)({
                        directoryPath: path_1.default.join(directoryPath, item),
                        isSubBranch: true,
                        pageExtensions: pageExtensions,
                        routesDataFileName: routesDataFileName,
                    })
                    : getRouteSegment(pageName || item, routeSegmentsData),
            ], false);
        }
        return acc;
    }, [])
        .sort(function (childA, childB) { return getOrderWeight(childA) - getOrderWeight(childB); });
    return __assign(__assign({}, getRouteSegment(name, routeSegmentsData, true)), { children: children });
};
exports.parsePages = parsePages;
//# sourceMappingURL=parsePages.js.map