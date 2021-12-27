"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyPredicate = void 0;
const argument_error_1 = require("../argument-error");
const base_predicate_1 = require("./base-predicate");
const generate_argument_error_message_1 = require("../utils/generate-argument-error-message");
/**
@hidden
*/
class AnyPredicate {
    constructor(predicates, options = {}) {
        Object.defineProperty(this, "predicates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: predicates
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
    }
    [base_predicate_1.testSymbol](value, main, label, idLabel) {
        const errors = new Map();
        for (const predicate of this.predicates) {
            try {
                main(value, label, predicate, idLabel);
                return;
            }
            catch (error) {
                if (value === undefined && this.options.optional === true) {
                    return;
                }
                // If we received an ArgumentError, then..
                if (error instanceof argument_error_1.ArgumentError) {
                    // Iterate through every error reported.
                    for (const [key, value] of error.validationErrors.entries()) {
                        // Get the current errors set, if any.
                        const alreadyPresent = errors.get(key);
                        // Add all errors under the same key
                        errors.set(key, new Set([...alreadyPresent !== null && alreadyPresent !== void 0 ? alreadyPresent : [], ...value]));
                    }
                }
            }
        }
        if (errors.size > 0) {
            // Generate the `error.message` property.
            const message = generate_argument_error_message_1.generateArgumentErrorMessage(errors, true);
            throw new argument_error_1.ArgumentError(`Any predicate failed with the following errors:\n${message}`, main, errors);
        }
    }
}
exports.AnyPredicate = AnyPredicate;
