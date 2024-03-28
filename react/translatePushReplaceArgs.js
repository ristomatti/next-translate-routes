"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatePushReplaceArgs = void 0;
var ntrData_1 = require("../shared/ntrData");
var fileUrlToFileUrlObject_1 = require("./fileUrlToFileUrlObject");
var fileUrlToUrl_1 = require("./fileUrlToUrl");
var getLocale_1 = require("./getLocale");
var removeLangPrefix_1 = require("./removeLangPrefix");
var urlToFileUrl_1 = require("./urlToFileUrl");
var translatePushReplaceArgs = function (_a) {
    var router = _a.router, url = _a.url, as = _a.as, locale = _a.locale;
    if (as) {
        return { url: url, as: as, locale: locale };
    }
    var newLocale = (0, getLocale_1.getLocale)(router, locale);
    var locales = router.locales || (0, ntrData_1.getNtrData)().locales;
    var unprefixedUrl = typeof url === 'string' ? (0, removeLangPrefix_1.removeLangPrefix)(url) : url;
    var urlLocale = typeof url === 'string' && unprefixedUrl !== url ? url.split('/')[1] : undefined;
    // propLocale === false if opted-out of automatically handling the locale prefixing
    // Cf. https://nextjs.org/docs/advanced-features/i18n-routing#transition-between-locales
    if (locale === false && urlLocale && locales.includes(urlLocale)) {
        newLocale = urlLocale;
    }
    /**
     * url can be:
     * - an external url
     * - a correct file url
     * - a wrong file url (not matching any page)
     * - a correct translated url
     * - a wrong translated url
     */
    try {
        /**
         * We need the parsedUrl to be in Next UrlObject synthax, otherwise there is conflicts with the as prop
         * See: https://github.com/hozana/next-translate-routes/issues/54
         */
        var parsedUrl = void 0;
        var translatedUrl = (0, fileUrlToUrl_1.fileUrlToUrl)(unprefixedUrl, newLocale, { throwOnError: false });
        if (translatedUrl) {
            // url is a correct file url
            parsedUrl = (0, fileUrlToFileUrlObject_1.fileUrlToFileUrlObject)(unprefixedUrl);
        }
        else {
            // url is not a correct file url
            parsedUrl = (0, urlToFileUrl_1.urlToFileUrl)(unprefixedUrl, urlLocale || newLocale);
            if (parsedUrl) {
                translatedUrl = (0, fileUrlToUrl_1.fileUrlToUrl)(parsedUrl, newLocale);
                // If fileUrlToUrl did not throw, url is a correct translated url
            }
        }
        return { url: parsedUrl || url, as: translatedUrl, locale: newLocale };
    }
    catch (error) {
        // url seems to be either a wrong file url or an external url:
        // do not bring changes if no translation is found
        return { url: url, locale: locale };
    }
};
exports.translatePushReplaceArgs = translatePushReplaceArgs;
//# sourceMappingURL=translatePushReplaceArgs.js.map