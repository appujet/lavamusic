"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeakSetPredicate = void 0;
const has_items_1 = require("../utils/has-items");
const predicate_1 = require("./predicate");
class WeakSetPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('WeakSet', options);
    }
    /**
    Test a WeakSet to include all the provided items. The items are tested by identity, not structure.

    @param items - The items that should be a item in the WeakSet.
    */
    has(...items) {
        return this.addValidator({
            message: (_, label, missingItems) => `Expected ${label} to have items \`${JSON.stringify(missingItems)}\``,
            validator: set => has_items_1.default(set, items)
        });
    }
    /**
    Test a WeakSet to include any of the provided items. The items are tested by identity, not structure.

    @param items - The items that could be a item in the WeakSet.
    */
    hasAny(...items) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any item of \`${JSON.stringify(items)}\``,
            validator: set => items.some(item => set.has(item))
        });
    }
}
exports.WeakSetPredicate = WeakSetPredicate;
