"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPredicate = exports.testSymbol = void 0;
/**
@hidden
*/
exports.testSymbol = Symbol('test');
/**
@hidden
*/
const isPredicate = (value) => Boolean(value[exports.testSymbol]);
exports.isPredicate = isPredicate;
