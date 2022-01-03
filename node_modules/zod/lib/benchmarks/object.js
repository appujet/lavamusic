"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var benchmark_1 = __importDefault(require("benchmark"));
var index_1 = require("../index");
var emptySuite = new benchmark_1.default.Suite("z.object: empty");
var shortSuite = new benchmark_1.default.Suite("z.object: short");
var longSuite = new benchmark_1.default.Suite("z.object: long");
var empty = index_1.z.object({});
var short = index_1.z.object({
    string: index_1.z.string(),
});
var long = index_1.z.object({
    string: index_1.z.string(),
    number: index_1.z.number(),
    boolean: index_1.z.boolean(),
});
emptySuite
    .add("valid", function () {
    empty.parse({});
})
    .add("valid: extra keys", function () {
    empty.parse({ string: "string" });
})
    .add("invalid: null", function () {
    try {
        empty.parse(null);
    }
    catch (err) { }
})
    .on("cycle", function (e) {
    console.log(emptySuite.name + ": " + e.target);
});
shortSuite
    .add("valid", function () {
    short.parse({ string: "string" });
})
    .add("valid: extra keys", function () {
    short.parse({ string: "string", number: 42 });
})
    .add("invalid: null", function () {
    try {
        short.parse(null);
    }
    catch (err) { }
})
    .on("cycle", function (e) {
    console.log(shortSuite.name + ": " + e.target);
});
longSuite
    .add("valid", function () {
    long.parse({ string: "string", number: 42, boolean: true });
})
    .add("valid: extra keys", function () {
    long.parse({ string: "string", number: 42, boolean: true, list: [] });
})
    .add("invalid: null", function () {
    try {
        long.parse(null);
    }
    catch (err) { }
})
    .on("cycle", function (e) {
    console.log(longSuite.name + ": " + e.target);
});
exports.default = {
    suites: [emptySuite, shortSuite, longSuite],
};
//# sourceMappingURL=object.js.map