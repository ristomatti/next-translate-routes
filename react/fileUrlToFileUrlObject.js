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
exports.fileUrlToFileUrlObject = void 0;
var ntrData_1 = require("../shared/ntrData");
var regex_1 = require("../shared/regex");
var parseUrl_1 = require("./parseUrl");
/**
 * Recursively get path file UrlObject from a route branch
 */
var getFileUrlObject = function (_a) {
    var e_1, _b, _c;
    var _d, _e;
    var routeBranch = _a.routeBranch, pathParts = _a.pathParts;
    if (pathParts.length === 0) {
        var optionalMatchAllChild = (_d = routeBranch.children) === null || _d === void 0 ? void 0 : _d.find(function (child) {
            return regex_1.optionalMatchAllFilepathPartRegex.test(child.name);
        });
        if (optionalMatchAllChild) {
            return { pathname: "/".concat(routeBranch.name, "/").concat(optionalMatchAllChild.name), query: {} };
        }
        return { pathname: "/".concat(routeBranch.name), query: {} };
    }
    var _f = __read(pathParts), nextPathPart = _f[0], remainingPathParts = _f.slice(1);
    // Next parts path: looking for the child corresponding to nextPathPart:
    // if nextPathPart does not match any child name and a dynamic child is found,
    // we will consider that nextPathPart is a value given to the dynamic child
    var matchingChild = undefined;
    try {
        for (var _g = __values(routeBranch.children || []), _h = _g.next(); !_h.done; _h = _g.next()) {
            var child = _h.value;
            if (
            // child.children must be coherent with remaining path parts is case a file and and folder share the same name
            remainingPathParts.length === 0 ||
                ((_e = child.children) === null || _e === void 0 ? void 0 : _e.length)) {
                if (child.name === nextPathPart) {
                    matchingChild = child;
                    break;
                }
                else if (
                // If nextPathPart already have a dynamic syntax, it must match the name, no need to go further
                !regex_1.anyDynamicFilepathPartRegex.test(nextPathPart) &&
                    // If the current child is dynamic and...
                    regex_1.anyDynamicFilepathPartRegex.test(child.name) &&
                    // ...there is no matching child found for now, or...
                    (!matchingChild ||
                        // ...the matchingChild has a sread syntax and the new one has not (priority)
                        (regex_1.spreadFilepathPartRegex.test(matchingChild.name) && regex_1.dynamicFilepathPartsRegex.test(child.name)))) {
                    matchingChild = child;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (matchingChild) {
        /** If we found an exact match, no need to add query */
        var isExactMatch = matchingChild.name === nextPathPart;
        var dynamicPathPartKey = (0, regex_1.getDynamicPathPartKey)(matchingChild.name);
        var _j = getFileUrlObject({
            routeBranch: matchingChild,
            pathParts: remainingPathParts,
        }), nextPathname = _j.pathname, nextQuery = _j.query;
        var pathname = "".concat(routeBranch.name ? "/".concat(routeBranch.name) : '').concat(nextPathname);
        var query = isExactMatch || !dynamicPathPartKey
            ? nextQuery
            : __assign((_c = {}, _c[dynamicPathPartKey] = regex_1.spreadFilepathPartRegex.test(matchingChild.name) ? pathParts : nextPathPart, _c), nextQuery);
        return { pathname: pathname, query: query };
    }
    throw new Error("No \"/".concat(pathParts.join('/'), "\" page found in /").concat(routeBranch.name, " folder."));
};
/**
 * Get the file UrlObject matching a string file url
 *
 * Ex: Given `/[dynamic]/path` is an existing file path,
 *
 * `/value/path?foo=bar` => { pathname: `/[dynamic]/path`, query: { dynamic: 'value', foo: 'bar' } }
 *
 * @throws if the fileUrl input does not match any page
 */
var fileUrlToFileUrlObject = function (fileUrl) {
    var _a = (0, parseUrl_1.parseUrl)(fileUrl), rawPathname = _a.pathname, initialQuery = _a.query, rest = __rest(_a, ["pathname", "query"]);
    var routesTree = (0, ntrData_1.getNtrData)().routesTree;
    if (!routesTree.children) {
        throw new Error('No page found. You probably need to add the pageDirectory option in your translateRoutes config.');
    }
    var _b = getFileUrlObject({
        pathParts: (rawPathname || '/').split('/').filter(Boolean),
        routeBranch: routesTree,
    }), pathname = _b.pathname, query = _b.query;
    return __assign({ pathname: pathname, query: __assign(__assign({}, query), initialQuery) }, rest);
};
exports.fileUrlToFileUrlObject = fileUrlToFileUrlObject;
//# sourceMappingURL=fileUrlToFileUrlObject.js.map