"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@sindresorhus/is");
const test_1 = require("../test");
const ofTypeDeep = (object, predicate) => {
    if (!is_1.default.plainObject(object)) {
        test_1.default(object, 'deep values', predicate, false);
        return true;
    }
    return Object.values(object).every(value => ofTypeDeep(value, predicate));
};
/**
Test all the values in the object against a provided predicate.

@hidden

@param predicate - Predicate to test every value in the given object against.
*/
exports.default = (object, predicate) => {
    try {
        return ofTypeDeep(object, predicate);
    }
    catch (error) {
        return error.message;
    }
};
