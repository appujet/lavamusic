"use strict";
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
exports.util = void 0;
var util;
(function (util) {
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = function (items) {
        var e_1, _a;
        var obj = {};
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                obj[item] = item;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return obj;
    };
    util.getValidEnumValues = function (obj) {
        var e_2, _a;
        var validKeys = util.objectKeys(obj).filter(function (k) { return typeof obj[obj[k]] !== "number"; });
        var filtered = {};
        try {
            for (var validKeys_1 = __values(validKeys), validKeys_1_1 = validKeys_1.next(); !validKeys_1_1.done; validKeys_1_1 = validKeys_1.next()) {
                var k = validKeys_1_1.value;
                filtered[k] = obj[k];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (validKeys_1_1 && !validKeys_1_1.done && (_a = validKeys_1.return)) _a.call(validKeys_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return util.objectValues(filtered);
    };
    util.objectValues = function (obj) {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? function (obj) { return Object.keys(obj); } // eslint-disable-line ban/ban
        : function (object) {
            var keys = [];
            for (var key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = function (arr, checker) {
        var e_3, _a;
        try {
            for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
                var item = arr_1_1.value;
                if (checker(item))
                    return item;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? function (val) { return Number.isInteger(val); } // eslint-disable-line ban/ban
        : function (val) {
            return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
        };
})(util = exports.util || (exports.util = {}));
//# sourceMappingURL=util.js.map