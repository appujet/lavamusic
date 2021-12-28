"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = void 0;
const random_id_1 = require("../utils/random-id");
const predicate_1 = require("../predicates/predicate");
/**
Operator which inverts the following validation.

@hidden

@param predictate - Predicate to wrap inside the operator.
*/
const not = (predicate) => {
    const originalAddValidator = predicate.addValidator;
    predicate.addValidator = (validator) => {
        const { validator: fn, message, negatedMessage } = validator;
        const placeholder = random_id_1.default();
        validator.message = (value, label) => (negatedMessage ?
            negatedMessage(value, label) :
            message(value, placeholder).replace(/ to /, '$&not ').replace(placeholder, label));
        validator.validator = (value) => !fn(value);
        predicate[predicate_1.validatorSymbol].push(validator);
        predicate.addValidator = originalAddValidator;
        return predicate;
    };
    return predicate;
};
exports.not = not;
