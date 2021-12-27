"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_predicate_1 = require("./predicates/base-predicate");
/**
Validate the value against the provided predicate.

@hidden

@param value - Value to test.
@param label - Label which should be used in error messages.
@param predicate - Predicate to test to value against.
@param idLabel - If true, the label is a variable or type. Default: true.
*/
function test(value, label, predicate, idLabel = true) {
    predicate[base_predicate_1.testSymbol](value, test, label, idLabel);
}
exports.default = test;
