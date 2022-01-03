"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.setErrorMap = exports.overrideErrorMap = exports.defaultErrorMap = exports.ZodError = exports.quotelessJson = exports.ZodIssueCode = void 0;
var util_1 = require("./helpers/util");
exports.ZodIssueCode = util_1.util.arrayToEnum([
    "invalid_type",
    "custom",
    "invalid_union",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
]);
var quotelessJson = function (obj) {
    var json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
exports.quotelessJson = quotelessJson;
var ZodError = /** @class */ (function (_super) {
    __extends(ZodError, _super);
    function ZodError(issues) {
        var _newTarget = this.constructor;
        var _this = _super.call(this) || this;
        _this.issues = [];
        _this.format = function () {
            var fieldErrors = { _errors: [] };
            var processError = function (error) {
                var e_1, _a;
                try {
                    for (var _b = __values(error.issues), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var issue = _c.value;
                        if (issue.code === "invalid_union") {
                            issue.unionErrors.map(processError);
                        }
                        else if (issue.code === "invalid_return_type") {
                            processError(issue.returnTypeError);
                        }
                        else if (issue.code === "invalid_arguments") {
                            processError(issue.argumentsError);
                        }
                        else if (issue.path.length === 0) {
                            fieldErrors._errors.push(issue.message);
                        }
                        else {
                            var curr = fieldErrors;
                            var i = 0;
                            while (i < issue.path.length) {
                                var el = issue.path[i];
                                var terminal = i === issue.path.length - 1;
                                if (!terminal) {
                                    if (typeof el === "string") {
                                        curr[el] = curr[el] || { _errors: [] };
                                    }
                                    else if (typeof el === "number") {
                                        var errorArray = [];
                                        errorArray._errors = [];
                                        curr[el] = curr[el] || errorArray;
                                    }
                                }
                                else {
                                    curr[el] = curr[el] || { _errors: [] };
                                    curr[el]._errors.push(issue.message);
                                }
                                curr = curr[el];
                                i++;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            };
            processError(_this);
            return fieldErrors;
        };
        _this.addIssue = function (sub) {
            _this.issues = __spreadArray(__spreadArray([], __read(_this.issues), false), [sub], false);
        };
        _this.addIssues = function (subs) {
            if (subs === void 0) { subs = []; }
            _this.issues = __spreadArray(__spreadArray([], __read(_this.issues), false), __read(subs), false);
        };
        _this.flatten = function (mapper) {
            var e_2, _a;
            if (mapper === void 0) { mapper = function (issue) { return issue.message; }; }
            var fieldErrors = {};
            var formErrors = [];
            try {
                for (var _b = __values(_this.issues), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var sub = _c.value;
                    if (sub.path.length > 0) {
                        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                        fieldErrors[sub.path[0]].push(mapper(sub));
                    }
                    else {
                        formErrors.push(mapper(sub));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return { formErrors: formErrors, fieldErrors: fieldErrors };
        };
        var actualProto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(_this, actualProto);
        }
        else {
            _this.__proto__ = actualProto;
        }
        _this.name = "ZodError";
        _this.issues = issues;
        return _this;
    }
    Object.defineProperty(ZodError.prototype, "errors", {
        get: function () {
            return this.issues;
        },
        enumerable: false,
        configurable: true
    });
    ZodError.prototype.toString = function () {
        return this.message;
    };
    Object.defineProperty(ZodError.prototype, "message", {
        get: function () {
            return JSON.stringify(this.issues, null, 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZodError.prototype, "isEmpty", {
        get: function () {
            return this.issues.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZodError.prototype, "formErrors", {
        get: function () {
            return this.flatten();
        },
        enumerable: false,
        configurable: true
    });
    ZodError.create = function (issues) {
        var error = new ZodError(issues);
        return error;
    };
    return ZodError;
}(Error));
exports.ZodError = ZodError;
var defaultErrorMap = function (issue, _ctx) {
    var message;
    switch (issue.code) {
        case exports.ZodIssueCode.invalid_type:
            if (issue.received === "undefined") {
                message = "Required";
            }
            else {
                message = "Expected " + issue.expected + ", received " + issue.received;
            }
            break;
        case exports.ZodIssueCode.unrecognized_keys:
            message = "Unrecognized key(s) in object: " + issue.keys
                .map(function (k) { return "'" + k + "'"; })
                .join(", ");
            break;
        case exports.ZodIssueCode.invalid_union:
            message = "Invalid input";
            break;
        case exports.ZodIssueCode.invalid_enum_value:
            message = "Invalid enum value. Expected " + issue.options
                .map(function (val) { return (typeof val === "string" ? "'" + val + "'" : val); })
                .join(" | ") + ", received " + (typeof _ctx.data === "string" ? "'" + _ctx.data + "'" : _ctx.data);
            break;
        case exports.ZodIssueCode.invalid_arguments:
            message = "Invalid function arguments";
            break;
        case exports.ZodIssueCode.invalid_return_type:
            message = "Invalid function return type";
            break;
        case exports.ZodIssueCode.invalid_date:
            message = "Invalid date";
            break;
        case exports.ZodIssueCode.invalid_string:
            if (issue.validation !== "regex")
                message = "Invalid " + issue.validation;
            else
                message = "Invalid";
            break;
        case exports.ZodIssueCode.too_small:
            if (issue.type === "array")
                message = "Should have " + (issue.inclusive ? "at least" : "more than") + " " + issue.minimum + " items";
            else if (issue.type === "string")
                message = "Should be " + (issue.inclusive ? "at least" : "over") + " " + issue.minimum + " characters";
            else if (issue.type === "number")
                message = "Value should be greater than " + (issue.inclusive ? "or equal to " : "") + issue.minimum;
            else
                message = "Invalid input";
            break;
        case exports.ZodIssueCode.too_big:
            if (issue.type === "array")
                message = "Should have " + (issue.inclusive ? "at most" : "less than") + " " + issue.maximum + " items";
            else if (issue.type === "string")
                message = "Should be " + (issue.inclusive ? "at most" : "under") + " " + issue.maximum + " characters long";
            else if (issue.type === "number")
                message = "Value should be less than " + (issue.inclusive ? "or equal to " : "") + issue.maximum;
            else
                message = "Invalid input";
            break;
        case exports.ZodIssueCode.custom:
            message = "Invalid input";
            break;
        case exports.ZodIssueCode.invalid_intersection_types:
            message = "Intersection results could not be merged";
            break;
        case exports.ZodIssueCode.not_multiple_of:
            message = "Should be multiple of " + issue.multipleOf;
            break;
        default:
            message = _ctx.defaultError;
            util_1.util.assertNever(issue);
    }
    return { message: message };
};
exports.defaultErrorMap = defaultErrorMap;
exports.overrideErrorMap = exports.defaultErrorMap;
var setErrorMap = function (map) {
    exports.overrideErrorMap = map;
};
exports.setErrorMap = setErrorMap;
//# sourceMappingURL=ZodError.js.map