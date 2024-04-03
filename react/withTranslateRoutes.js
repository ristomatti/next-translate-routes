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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTranslateRoutes = void 0;
var router_context_shared_runtime_1 = require("next/dist/shared/lib/router-context.shared-runtime");
var router_1 = require("next/router");
var react_1 = __importStar(require("react"));
var ntrData_1 = require("../shared/ntrData");
var withNtrPrefix_1 = require("../shared/withNtrPrefix");
var enhanceNextRouter_1 = require("./enhanceNextRouter");
/**
 * Must wrap the App component in `pages/_app`.
 * This HOC will make the route push, replace, and refetch functions able to translate routes.
 */
var withTranslateRoutes = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // ntrData argument is added as a argument by webpack next-translate-routes/loader, and can also be added manually
    var _a = args.reduce(function (acc, arg) {
        if (typeof arg === 'function') {
            return __assign(__assign({}, acc), { AppComponent: arg });
        }
        return __assign(__assign({}, acc), { ntrData: __assign(__assign({}, acc.ntrData), arg) });
    }, {}), ntrData = _a.ntrData, AppComponent = _a.AppComponent;
    if (!AppComponent) {
        throw new Error(withNtrPrefix_1.ntrMessagePrefix + 'No wrapped App component in withTranslateRoutes');
    }
    if (!ntrData) {
        throw new Error(withNtrPrefix_1.ntrMessagePrefix +
            'No translate routes data found. next-translate-routes plugin is probably missing from next.config.js');
    }
    (0, ntrData_1.setNtrData)(ntrData);
    if (ntrData.debug && typeof window !== 'undefined') {
        console.log(withNtrPrefix_1.ntrMessagePrefix + 'withTranslateRoutes. NTR data:', ntrData);
    }
    var WithTranslateRoutesApp = function (props) {
        var nextRouter = (0, router_1.useRouter)();
        var enhancedRouter = (0, react_1.useMemo)(function () { return (nextRouter ? (0, enhanceNextRouter_1.enhanceNextRouter)(nextRouter) : props.router); }, [nextRouter, props.router]);
        if (nextRouter && !nextRouter.locale) {
            var fallbackLocale = ntrData.defaultLocale || ntrData.locales[0];
            nextRouter.locale = fallbackLocale;
            console.error(withNtrPrefix_1.ntrMessagePrefix + "No locale prop in Router: fallback to ".concat(fallbackLocale, "."));
        }
        return (react_1.default.createElement(router_context_shared_runtime_1.RouterContext.Provider, { value: enhancedRouter },
            react_1.default.createElement(AppComponent, __assign({}, props))));
    };
    WithTranslateRoutesApp.getInitialProps = 'getInitialProps' in AppComponent ? AppComponent.getInitialProps : undefined;
    return WithTranslateRoutesApp;
};
exports.withTranslateRoutes = withTranslateRoutes;
//# sourceMappingURL=withTranslateRoutes.js.map