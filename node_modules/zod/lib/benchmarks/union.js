"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var benchmark_1 = __importDefault(require("benchmark"));
var index_1 = require("../index");
var doubleSuite = new benchmark_1.default.Suite("z.union: double");
var manySuite = new benchmark_1.default.Suite("z.union: many");
var aSchema = index_1.z.object({
    type: index_1.z.literal("a"),
});
var objA = {
    type: "a",
};
var bSchema = index_1.z.object({
    type: index_1.z.literal("b"),
});
var objB = {
    type: "b",
};
var cSchema = index_1.z.object({
    type: index_1.z.literal("c"),
});
var objC = {
    type: "c",
};
var dSchema = index_1.z.object({
    type: index_1.z.literal("d"),
});
var double = index_1.z.union([aSchema, bSchema]);
var many = index_1.z.union([aSchema, bSchema, cSchema, dSchema]);
doubleSuite
    .add("valid: a", function () {
    double.parse(objA);
})
    .add("valid: b", function () {
    double.parse(objB);
})
    .add("invalid: null", function () {
    try {
        double.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", function () {
    try {
        double.parse(objC);
    }
    catch (err) { }
})
    .on("cycle", function (e) {
    console.log(doubleSuite.name + ": " + e.target);
});
manySuite
    .add("valid: a", function () {
    many.parse(objA);
})
    .add("valid: c", function () {
    many.parse(objC);
})
    .add("invalid: null", function () {
    try {
        many.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", function () {
    try {
        many.parse({ type: "unknown" });
    }
    catch (err) { }
})
    .on("cycle", function (e) {
    console.log(manySuite.name + ": " + e.target);
});
exports.default = {
    suites: [doubleSuite, manySuite],
};
//# sourceMappingURL=union.js.map