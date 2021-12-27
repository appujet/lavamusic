"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicates_1 = require("./predicates");
exports.default = (object) => {
    Object.defineProperties(object, {
        optional: {
            get: () => predicates_1.default({}, { optional: true })
        }
    });
    return object;
};
