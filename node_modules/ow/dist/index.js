"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentError = exports.Predicate = void 0;
const callsites_1 = require("callsites");
const infer_label_1 = require("./utils/infer-label");
const predicate_1 = require("./predicates/predicate");
Object.defineProperty(exports, "Predicate", { enumerable: true, get: function () { return predicate_1.Predicate; } });
const base_predicate_1 = require("./predicates/base-predicate");
const modifiers_1 = require("./modifiers");
const predicates_1 = require("./predicates");
const test_1 = require("./test");
const ow = (value, labelOrPredicate, predicate) => {
    if (!base_predicate_1.isPredicate(labelOrPredicate) && typeof labelOrPredicate !== 'string') {
        throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof labelOrPredicate}\``);
    }
    if (base_predicate_1.isPredicate(labelOrPredicate)) {
        // If the second argument is a predicate, infer the label
        const stackFrames = callsites_1.default();
        test_1.default(value, () => infer_label_1.inferLabel(stackFrames), labelOrPredicate);
        return;
    }
    test_1.default(value, labelOrPredicate, predicate);
};
Object.defineProperties(ow, {
    isValid: {
        value: (value, predicate) => {
            try {
                test_1.default(value, '', predicate);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    create: {
        value: (labelOrPredicate, predicate) => (value, label) => {
            if (base_predicate_1.isPredicate(labelOrPredicate)) {
                const stackFrames = callsites_1.default();
                test_1.default(value, label !== null && label !== void 0 ? label : (() => infer_label_1.inferLabel(stackFrames)), labelOrPredicate);
                return;
            }
            test_1.default(value, label !== null && label !== void 0 ? label : (labelOrPredicate), predicate);
        }
    }
});
// Can't use `export default predicates(modifiers(ow)) as Ow` because the variable needs a type annotation to avoid a compiler error when used:
// Assertions require every name in the call target to be declared with an explicit type annotation.ts(2775)
// See https://github.com/microsoft/TypeScript/issues/36931 for more details.
const _ow = predicates_1.default(modifiers_1.default(ow));
exports.default = _ow;
__exportStar(require("./predicates"), exports);
var argument_error_1 = require("./argument-error");
Object.defineProperty(exports, "ArgumentError", { enumerable: true, get: function () { return argument_error_1.ArgumentError; } });
