"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNextVersion = void 0;
var package_json_1 = __importDefault(require("next/package.json"));
var parseVersion = function (version) {
    var _a, _b, _c;
    return (_c = (_b = (_a = version === null || version === void 0 ? void 0 : version.match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/)) === null || _a === void 0 ? void 0 : _a.slice(1)) === null || _b === void 0 ? void 0 : _b.filter(Boolean)) === null || _c === void 0 ? void 0 : _c.map(Number);
};
var checkNextVersion = function (
/** Ex: '>=13.3.1', '!=12.2.4' */
version, 
/** Fallback if next version is not found */
fallback) {
    if (fallback === void 0) { fallback = false; }
    var referenceVersion = parseVersion(version);
    var nextVersion = parseVersion(package_json_1.default.version);
    if (!referenceVersion || !nextVersion) {
        return fallback;
    }
    var comparison = 0;
    for (var i = 0; i < referenceVersion.length; i++) {
        if (nextVersion[i] !== referenceVersion[i]) {
            comparison = nextVersion[i] > referenceVersion[i] ? 1 : -1;
            break;
        }
    }
    if ((version.includes('!=') && comparison !== 0) ||
        (version.includes('=') && !version.includes('!=') && comparison === 0) ||
        (version.includes('<') && comparison === -1) ||
        (version.includes('>') && comparison === 1)) {
        return true;
    }
    return false;
};
exports.checkNextVersion = checkNextVersion;
//# sourceMappingURL=checkNextVersion.js.map