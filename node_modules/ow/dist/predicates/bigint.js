"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntPredicate = void 0;
const predicate_1 = require("./predicate");
class BigIntPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('bigint', options);
    }
}
exports.BigIntPredicate = BigIntPredicate;
