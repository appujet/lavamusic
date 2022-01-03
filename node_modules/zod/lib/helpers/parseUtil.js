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
        while (_) try {
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
exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.addIssueToContext = exports.EMPTY_PATH = exports.makeIssue = exports.getParsedType = exports.ZodParsedType = void 0;
var ZodError_1 = require("../ZodError");
var util_1 = require("./util");
exports.ZodParsedType = util_1.util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
function cacheAndReturn(data, parsedType, cache) {
    if (cache)
        cache.set(data, parsedType);
    return parsedType;
}
var getParsedType = function (data, cache) {
    if (cache && cache.has(data))
        return cache.get(data);
    var t = typeof data;
    switch (t) {
        case "undefined":
            return cacheAndReturn(data, exports.ZodParsedType.undefined, cache);
        case "string":
            return cacheAndReturn(data, exports.ZodParsedType.string, cache);
        case "number":
            return cacheAndReturn(data, isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number, cache);
        case "boolean":
            return cacheAndReturn(data, exports.ZodParsedType.boolean, cache);
        case "function":
            return cacheAndReturn(data, exports.ZodParsedType.function, cache);
        case "bigint":
            return cacheAndReturn(data, exports.ZodParsedType.bigint, cache);
        case "object":
            if (Array.isArray(data)) {
                return cacheAndReturn(data, exports.ZodParsedType.array, cache);
            }
            if (data === null) {
                return cacheAndReturn(data, exports.ZodParsedType.null, cache);
            }
            if (data.then &&
                typeof data.then === "function" &&
                data.catch &&
                typeof data.catch === "function") {
                return cacheAndReturn(data, exports.ZodParsedType.promise, cache);
            }
            if (data instanceof Map) {
                return cacheAndReturn(data, exports.ZodParsedType.map, cache);
            }
            if (data instanceof Set) {
                return cacheAndReturn(data, exports.ZodParsedType.set, cache);
            }
            if (data instanceof Date) {
                return cacheAndReturn(data, exports.ZodParsedType.date, cache);
            }
            return cacheAndReturn(data, exports.ZodParsedType.object, cache);
        default:
            return cacheAndReturn(data, exports.ZodParsedType.unknown, cache);
    }
};
exports.getParsedType = getParsedType;
var makeIssue = function (params) {
    var e_1, _a;
    var data = params.data, path = params.path, errorMaps = params.errorMaps, issueData = params.issueData;
    var fullPath = __spreadArray(__spreadArray([], __read(path), false), __read((issueData.path || [])), false);
    var fullIssue = __assign(__assign({}, issueData), { path: fullPath });
    var errorMessage = "";
    var maps = errorMaps
        .filter(function (m) { return !!m; })
        .slice()
        .reverse();
    try {
        for (var maps_1 = __values(maps), maps_1_1 = maps_1.next(); !maps_1_1.done; maps_1_1 = maps_1.next()) {
            var map = maps_1_1.value;
            errorMessage = map(fullIssue, { data: data, defaultError: errorMessage }).message;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (maps_1_1 && !maps_1_1.done && (_a = maps_1.return)) _a.call(maps_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return __assign(__assign({}, issueData), { path: fullPath, message: issueData.message || errorMessage });
};
exports.makeIssue = makeIssue;
exports.EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    var issue = (0, exports.makeIssue)({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.contextualErrorMap,
            ctx.schemaErrorMap,
            ZodError_1.overrideErrorMap,
            ZodError_1.defaultErrorMap, // then global default map
        ].filter(function (x) { return !!x; }),
    });
    ctx.issues.push(issue);
}
exports.addIssueToContext = addIssueToContext;
var ParseStatus = /** @class */ (function () {
    function ParseStatus() {
        this.value = "valid";
    }
    ParseStatus.prototype.dirty = function () {
        if (this.value === "valid")
            this.value = "dirty";
    };
    ParseStatus.prototype.abort = function () {
        if (this.value !== "aborted")
            this.value = "aborted";
    };
    ParseStatus.mergeArray = function (status, results) {
        var e_2, _a;
        var arrayValue = [];
        try {
            for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                var s = results_1_1.value;
                if (s.status === "aborted")
                    return exports.INVALID;
                if (s.status === "dirty")
                    status.dirty();
                arrayValue.push(s.value);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return { status: status.value, value: arrayValue };
    };
    ParseStatus.mergeObjectAsync = function (status, pairs) {
        return __awaiter(this, void 0, void 0, function () {
            var syncPairs, pairs_1, pairs_1_1, pair, _a, _b, e_3_1;
            var e_3, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        syncPairs = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 7, 8, 9]);
                        pairs_1 = __values(pairs), pairs_1_1 = pairs_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!pairs_1_1.done) return [3 /*break*/, 6];
                        pair = pairs_1_1.value;
                        _b = (_a = syncPairs).push;
                        _d = {};
                        return [4 /*yield*/, pair.key];
                    case 3:
                        _d.key = _e.sent();
                        return [4 /*yield*/, pair.value];
                    case 4:
                        _b.apply(_a, [(_d.value = _e.sent(),
                                _d)]);
                        _e.label = 5;
                    case 5:
                        pairs_1_1 = pairs_1.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (pairs_1_1 && !pairs_1_1.done && (_c = pairs_1.return)) _c.call(pairs_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, ParseStatus.mergeObjectSync(status, syncPairs)];
                }
            });
        });
    };
    ParseStatus.mergeObjectSync = function (status, pairs) {
        var e_4, _a;
        var finalObject = {};
        try {
            for (var pairs_2 = __values(pairs), pairs_2_1 = pairs_2.next(); !pairs_2_1.done; pairs_2_1 = pairs_2.next()) {
                var pair = pairs_2_1.value;
                var key = pair.key, value = pair.value;
                if (key.status === "aborted")
                    return exports.INVALID;
                if (value.status === "aborted")
                    return exports.INVALID;
                if (key.status === "dirty")
                    status.dirty();
                if (value.status === "dirty")
                    status.dirty();
                if (typeof value.value !== "undefined" || pair.alwaysSet) {
                    finalObject[key.value] = value.value;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (pairs_2_1 && !pairs_2_1.done && (_a = pairs_2.return)) _a.call(pairs_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return { status: status.value, value: finalObject };
    };
    return ParseStatus;
}());
exports.ParseStatus = ParseStatus;
exports.INVALID = Object.freeze({
    status: "aborted",
});
var DIRTY = function (value) { return ({ status: "dirty", value: value }); };
exports.DIRTY = DIRTY;
var OK = function (value) { return ({ status: "valid", value: value }); };
exports.OK = OK;
var isAborted = function (x) {
    return x.status === "aborted";
};
exports.isAborted = isAborted;
var isDirty = function (x) {
    return x.status === "dirty";
};
exports.isDirty = isDirty;
var isValid = function (x) {
    return x.status === "valid";
};
exports.isValid = isValid;
var isAsync = function (x) { return x instanceof Promise; };
exports.isAsync = isAsync;
//# sourceMappingURL=parseUtil.js.map