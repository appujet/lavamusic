"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanPredicate = void 0;
const predicate_1 = require("./predicate");
class BooleanPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('boolean', options);
    }
    /**
    Test a boolean to be true.
    */
    get true() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be true, got ${value}`,
            validator: value => value
        });
    }
    /**
    Test a boolean to be false.
    */
    get false() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be false, got ${value}`,
            validator: value => !value
        });
    }
}
exports.BooleanPredicate = BooleanPredicate;
