"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorUtil = void 0;
var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = function (message) {
        return typeof message === "string" ? { message: message } : message || {};
    };
    errorUtil.toString = function (message) {
        return typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    };
})(errorUtil = exports.errorUtil || (exports.errorUtil = {}));
//# sourceMappingURL=errorUtil.js.map