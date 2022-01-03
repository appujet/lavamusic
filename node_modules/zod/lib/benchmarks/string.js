"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var benchmark_1 = __importDefault(require("benchmark"));
var index_1 = require("../index");
var SUITE_NAME = "z.string";
var suite = new benchmark_1.default.Suite(SUITE_NAME);
var empty = "";
var short = "short";
var long = "long".repeat(256);
var manual = function (str) {
    if (typeof str !== "string") {
        throw new Error("Not a string");
    }
    return str;
};
var stringSchema = index_1.z.string();
suite
    .add("empty string", function () {
    stringSchema.parse(empty);
})
    .add("short string", function () {
    stringSchema.parse(short);
})
    .add("long string", function () {
    stringSchema.parse(long);
})
    .add("invalid: null", function () {
    try {
        stringSchema.parse(null);
    }
    catch (err) { }
})
    .add("manual parser: long", function () {
    manual(long);
})
    .on("cycle", function (e) {
    console.log(SUITE_NAME + ": " + e.target);
});
exports.default = {
    suites: [suite],
};
//# sourceMappingURL=string.js.map