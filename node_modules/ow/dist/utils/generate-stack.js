"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStackTrace = void 0;
/**
Generates a useful stacktrace that points to the user's code where the error happened on platforms without the `Error.captureStackTrace()` method.

@hidden
*/
const generateStackTrace = () => {
    const stack = new RangeError('INTERNAL_OW_ERROR').stack;
    return stack;
};
exports.generateStackTrace = generateStackTrace;
