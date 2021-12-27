"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../test");
/**
Test all the values in the collection against a provided predicate.

@hidden
@param source Source collection to test.
@param name The name to call the collection of values, such as `values` or `keys`.
@param predicate Predicate to test every item in the source collection against.
*/
exports.default = (source, name, predicate) => {
    try {
        for (const item of source) {
            test_1.default(item, name, predicate, false);
        }
        return true;
    }
    catch (error) {
        return error.message;
    }
};
