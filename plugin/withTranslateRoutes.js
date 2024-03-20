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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTranslateRoutes = void 0;
var ntrData_1 = require("../shared/ntrData");
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
var createNtrData_1 = require("./createNtrData");
var getPagesPath_1 = require("./getPagesPath");
var getRouteBranchReRoutes_1 = require("./getRouteBranchReRoutes");
var routesFiles_1 = require("./routesFiles");
/**
 * Sort redirects and rewrites by descending specificity:
 * - first by descending number of regexp in source
 * - then by descending number of path segments
 */
var sortBySpecificity = function (rArray) {
    return rArray.sort(function (a, b) {
        if (a.source.includes(':') && !b.source.includes(':')) {
            return 1;
        }
        if (!a.source.includes(':') && b.source.includes(':')) {
            return -1;
        }
        return b.source.split('/').length - a.source.split('/').length;
    });
};
/**
 * Inject translated routes
 */
var withTranslateRoutes = function (userNextConfig) {
    var _a = userNextConfig.translateRoutes, _b = _a === void 0 ? {} : _a, debug = _b.debug, pagesDirectory = _b.pagesDirectory, nextConfig = __rest(userNextConfig, ["translateRoutes"]);
    if (!nextConfig.i18n) {
        throw new Error(withNtrPrefix_1.ntrMessagePrefix +
            'No i18n config found in next.config.js. i18n config is mandatory to use next-translate-routes.\nSeehttps://nextjs.org/docs/advanced-features/i18n-routing');
    }
    var pagesPath = (0, getPagesPath_1.getPagesPath)(pagesDirectory);
    var ntrData = (0, createNtrData_1.createNtrData)(userNextConfig, pagesPath);
    (0, ntrData_1.setNtrData)(ntrData);
    var _c = (0, getRouteBranchReRoutes_1.getRouteBranchReRoutes)(), redirects = _c.redirects, rewrites = _c.rewrites;
    var sortedRedirects = sortBySpecificity(redirects);
    var sortedRewrites = sortBySpecificity(rewrites);
    if (debug) {
        console.log(withNtrPrefix_1.ntrMessagePrefix + 'Redirects:', sortedRedirects);
        console.log(withNtrPrefix_1.ntrMessagePrefix + 'Rewrites:', sortedRewrites);
    }
    return __assign(__assign({}, nextConfig), { webpack: function (conf, context) {
            var config = typeof nextConfig.webpack === 'function' ? nextConfig.webpack(conf, context) : conf;
            config.cache = typeof config.cache === 'object' ? config.cache : { type: 'filesystem' };
            config.cache.buildDependencies = config.cache.buildDependencies || {};
            config.cache.buildDependencies.ntrRoutes = (0, routesFiles_1.getAllRoutesFiles)();
            if (!config.module) {
                config.module = {};
            }
            if (!config.module.rules) {
                config.module.rules = [];
            }
            config.module.rules.push({
                test: new RegExp("".concat(pagesPath.replace(/\\|\//g, '(\\\\|\\/)'), "_app\\.(").concat(context.config.pageExtensions.join('|'), ")$")),
                use: {
                    loader: 'next-translate-routes/loader',
                    options: {
                        data: ntrData,
                    },
                },
            });
            return config;
        }, redirects: function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingRedirects, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = nextConfig.redirects;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, nextConfig.redirects()];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            existingRedirects = (_a) || [];
                            return [2 /*return*/, __spreadArray(__spreadArray([], __read(sortedRedirects), false), __read(existingRedirects), false)];
                    }
                });
            });
        }, rewrites: function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingRewrites, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = nextConfig.rewrites;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, nextConfig.rewrites()];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            existingRewrites = (_a) || [];
                            if (Array.isArray(existingRewrites)) {
                                // Add .map((rw) => ({ ...rw })) to solve next 13.3 rewrites issue https://github.com/hozana/next-translate-routes/issues/68
                                return [2 /*return*/, __spreadArray(__spreadArray([], __read(existingRewrites), false), __read(sortedRewrites), false).map(function (rw) { return (__assign({}, rw)); })];
                            }
                            return [2 /*return*/, __assign(__assign({}, existingRewrites), { 
                                    // Add .map((rw) => ({ ...rw })) to solve next 13.3 rewrites issue https://github.com/hozana/next-translate-routes/issues/68
                                    afterFiles: __spreadArray(__spreadArray([], __read((existingRewrites.afterFiles || [])), false), __read(sortedRewrites), false).map(function (rw) { return (__assign({}, rw)); }) })];
                    }
                });
            });
        } });
};
exports.withTranslateRoutes = withTranslateRoutes;
//# sourceMappingURL=withTranslateRoutes.js.map