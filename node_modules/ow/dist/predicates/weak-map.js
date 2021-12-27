"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeakMapPredicate = void 0;
const has_items_1 = require("../utils/has-items");
const predicate_1 = require("./predicate");
class WeakMapPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('WeakMap', options);
    }
    /**
    Test a WeakMap to include all the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that should be a key in the WeakMap.
    */
    hasKeys(...keys) {
        return this.addValidator({
            message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
            validator: map => has_items_1.default(map, keys)
        });
    }
    /**
    Test a WeakMap to include any of the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that could be a key in the WeakMap.
    */
    hasAnyKeys(...keys) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
            validator: map => keys.some(key => map.has(key))
        });
    }
}
exports.WeakMapPredicate = WeakMapPredicate;
