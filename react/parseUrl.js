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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = void 0;
var querystring_1 = require("querystring");
var url_1 = require("url");
/** Parse an url and its query to object */
var parseUrl = function (url) {
    return typeof url === 'string' || url instanceof URL
        ? (0, url_1.parse)(url.toString(), true)
        : __assign(__assign({}, url), { query: typeof url.query === 'string' ? (0, querystring_1.parse)(url.query) : url.query });
};
exports.parseUrl = parseUrl;
//# sourceMappingURL=parseUrl.js.map