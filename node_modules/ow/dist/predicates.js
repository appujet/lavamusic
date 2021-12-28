"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyPredicate = exports.DataViewPredicate = exports.ArrayBufferPredicate = exports.TypedArrayPredicate = exports.WeakSetPredicate = exports.SetPredicate = exports.WeakMapPredicate = exports.MapPredicate = exports.ErrorPredicate = exports.DatePredicate = exports.ObjectPredicate = exports.ArrayPredicate = exports.BooleanPredicate = exports.BigIntPredicate = exports.NumberPredicate = exports.StringPredicate = void 0;
const string_1 = require("./predicates/string");
Object.defineProperty(exports, "StringPredicate", { enumerable: true, get: function () { return string_1.StringPredicate; } });
const number_1 = require("./predicates/number");
Object.defineProperty(exports, "NumberPredicate", { enumerable: true, get: function () { return number_1.NumberPredicate; } });
const bigint_1 = require("./predicates/bigint");
Object.defineProperty(exports, "BigIntPredicate", { enumerable: true, get: function () { return bigint_1.BigIntPredicate; } });
const boolean_1 = require("./predicates/boolean");
Object.defineProperty(exports, "BooleanPredicate", { enumerable: true, get: function () { return boolean_1.BooleanPredicate; } });
const predicate_1 = require("./predicates/predicate");
const array_1 = require("./predicates/array");
Object.defineProperty(exports, "ArrayPredicate", { enumerable: true, get: function () { return array_1.ArrayPredicate; } });
const object_1 = require("./predicates/object");
Object.defineProperty(exports, "ObjectPredicate", { enumerable: true, get: function () { return object_1.ObjectPredicate; } });
const date_1 = require("./predicates/date");
Object.defineProperty(exports, "DatePredicate", { enumerable: true, get: function () { return date_1.DatePredicate; } });
const error_1 = require("./predicates/error");
Object.defineProperty(exports, "ErrorPredicate", { enumerable: true, get: function () { return error_1.ErrorPredicate; } });
const map_1 = require("./predicates/map");
Object.defineProperty(exports, "MapPredicate", { enumerable: true, get: function () { return map_1.MapPredicate; } });
const weak_map_1 = require("./predicates/weak-map");
Object.defineProperty(exports, "WeakMapPredicate", { enumerable: true, get: function () { return weak_map_1.WeakMapPredicate; } });
const set_1 = require("./predicates/set");
Object.defineProperty(exports, "SetPredicate", { enumerable: true, get: function () { return set_1.SetPredicate; } });
const weak_set_1 = require("./predicates/weak-set");
Object.defineProperty(exports, "WeakSetPredicate", { enumerable: true, get: function () { return weak_set_1.WeakSetPredicate; } });
const typed_array_1 = require("./predicates/typed-array");
Object.defineProperty(exports, "TypedArrayPredicate", { enumerable: true, get: function () { return typed_array_1.TypedArrayPredicate; } });
const array_buffer_1 = require("./predicates/array-buffer");
Object.defineProperty(exports, "ArrayBufferPredicate", { enumerable: true, get: function () { return array_buffer_1.ArrayBufferPredicate; } });
const data_view_1 = require("./predicates/data-view");
Object.defineProperty(exports, "DataViewPredicate", { enumerable: true, get: function () { return data_view_1.DataViewPredicate; } });
const any_1 = require("./predicates/any");
Object.defineProperty(exports, "AnyPredicate", { enumerable: true, get: function () { return any_1.AnyPredicate; } });
exports.default = (object, options) => {
    Object.defineProperties(object, {
        string: {
            get: () => new string_1.StringPredicate(options)
        },
        number: {
            get: () => new number_1.NumberPredicate(options)
        },
        bigint: {
            get: () => new bigint_1.BigIntPredicate(options)
        },
        boolean: {
            get: () => new boolean_1.BooleanPredicate(options)
        },
        undefined: {
            get: () => new predicate_1.Predicate('undefined', options)
        },
        null: {
            get: () => new predicate_1.Predicate('null', options)
        },
        nullOrUndefined: {
            get: () => new predicate_1.Predicate('nullOrUndefined', options)
        },
        nan: {
            get: () => new predicate_1.Predicate('nan', options)
        },
        symbol: {
            get: () => new predicate_1.Predicate('symbol', options)
        },
        array: {
            get: () => new array_1.ArrayPredicate(options)
        },
        object: {
            get: () => new object_1.ObjectPredicate(options)
        },
        date: {
            get: () => new date_1.DatePredicate(options)
        },
        error: {
            get: () => new error_1.ErrorPredicate(options)
        },
        map: {
            get: () => new map_1.MapPredicate(options)
        },
        weakMap: {
            get: () => new weak_map_1.WeakMapPredicate(options)
        },
        set: {
            get: () => new set_1.SetPredicate(options)
        },
        weakSet: {
            get: () => new weak_set_1.WeakSetPredicate(options)
        },
        function: {
            get: () => new predicate_1.Predicate('Function', options)
        },
        buffer: {
            get: () => new predicate_1.Predicate('Buffer', options)
        },
        regExp: {
            get: () => new predicate_1.Predicate('RegExp', options)
        },
        promise: {
            get: () => new predicate_1.Predicate('Promise', options)
        },
        typedArray: {
            get: () => new typed_array_1.TypedArrayPredicate('TypedArray', options)
        },
        int8Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int8Array', options)
        },
        uint8Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint8Array', options)
        },
        uint8ClampedArray: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint8ClampedArray', options)
        },
        int16Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int16Array', options)
        },
        uint16Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint16Array', options)
        },
        int32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int32Array', options)
        },
        uint32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint32Array', options)
        },
        float32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Float32Array', options)
        },
        float64Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Float64Array', options)
        },
        arrayBuffer: {
            get: () => new array_buffer_1.ArrayBufferPredicate('ArrayBuffer', options)
        },
        sharedArrayBuffer: {
            get: () => new array_buffer_1.ArrayBufferPredicate('SharedArrayBuffer', options)
        },
        dataView: {
            get: () => new data_view_1.DataViewPredicate(options)
        },
        iterable: {
            get: () => new predicate_1.Predicate('Iterable', options)
        },
        any: {
            value: (...predicates) => new any_1.AnyPredicate(predicates, options)
        }
    });
    return object;
};
