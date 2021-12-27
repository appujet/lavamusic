"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentError = void 0;
const generate_stack_1 = require("./utils/generate-stack");
const wrapStackTrace = (error, stack) => `${error.name}: ${error.message}\n${stack}`;
/**
@hidden
*/
class ArgumentError extends Error {
    constructor(message, context, errors = new Map()) {
        super(message);
        Object.defineProperty(this, "validationErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'ArgumentError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, context);
        }
        else {
            this.stack = wrapStackTrace(this, generate_stack_1.generateStackTrace());
        }
        this.validationErrors = errors;
    }
}
exports.ArgumentError = ArgumentError;
