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
exports.enhanceNextRouter = void 0;
var querystring_1 = require("querystring");
var ntrData_1 = require("../shared/ntrData");
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
var getLocale_1 = require("./getLocale");
var translatePushReplaceArgs_1 = require("./translatePushReplaceArgs");
var urlToFileUrl_1 = require("./urlToFileUrl");
var logWithTrace = function (from, details) {
    console.groupCollapsed(withNtrPrefix_1.ntrMessagePrefix + from, details);
    console.trace('Stringified:\n', JSON.stringify(details, null, 4));
    console.groupEnd();
};
var enhancePushReplace = function (router, fnName) {
    return function (url, as, options) {
        var translatedArgs = (0, translatePushReplaceArgs_1.translatePushReplaceArgs)({ router: router, url: url, as: as, locale: options === null || options === void 0 ? void 0 : options.locale });
        if ((0, ntrData_1.getNtrData)().debug) {
            logWithTrace("router.".concat(fnName), {
                original: {
                    url: url,
                    as: as,
                    options: options,
                },
                translated: translatedArgs,
            });
        }
        return router[fnName](translatedArgs.url, translatedArgs.as, __assign(__assign({}, options), { locale: translatedArgs.locale }));
    };
};
var enhancePrefetch = function (router) {
    return function (inputUrl, asPath, options) {
        var locale = (0, getLocale_1.getLocale)(router, options === null || options === void 0 ? void 0 : options.locale);
        var parsedInputUrl = (0, urlToFileUrl_1.urlToFileUrl)(inputUrl, locale);
        if ((0, ntrData_1.getNtrData)().debug === 'withPrefetch') {
            logWithTrace('router.prefetch', { inputUrl: inputUrl, asPath: asPath, options: options, parsedInputUrl: parsedInputUrl, locale: locale });
        }
        return router.prefetch(parsedInputUrl
            ? (parsedInputUrl.pathname || '/') +
                (parsedInputUrl.query &&
                    "?".concat(typeof parsedInputUrl.query === 'string' ? parsedInputUrl.query : (0, querystring_1.stringify)(parsedInputUrl.query)))
            : inputUrl, asPath, options);
    };
};
var enhanceNextRouter = function (router) {
    if ('router' in router) {
        return new Proxy(router, {
            get: function (target, p) {
                if (p === 'push' || p === 'replace') {
                    return enhancePushReplace(target, p);
                }
                if (p === 'prefetch') {
                    return enhancePrefetch(target);
                }
                return target[p];
            },
        });
    }
    return __assign(__assign({}, router), { push: enhancePushReplace(router, 'push'), replace: enhancePushReplace(router, 'replace'), prefetch: enhancePrefetch(router) });
};
exports.enhanceNextRouter = enhanceNextRouter;
//# sourceMappingURL=enhanceNextRouter.js.map