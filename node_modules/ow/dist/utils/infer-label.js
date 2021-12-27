"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferLabel = void 0;
const fs = require("fs");
const is_valid_identifier_1 = require("./is-valid-identifier");
const is_node_1 = require("./node/is-node");
// Regex to extract the label out of the `ow` function call
const labelRegex = /^.*?\((?<label>.*?)[,)]/;
/**
Infer the label of the caller.

@hidden

@param callsites - List of stack frames.
*/
const inferLabel = (callsites) => {
    var _a;
    if (!is_node_1.default) {
        // Exit if we are not running in a Node.js environment
        return;
    }
    // Grab the stackframe with the `ow` function call
    const functionCallStackFrame = callsites[1];
    if (!functionCallStackFrame) {
        return;
    }
    const fileName = functionCallStackFrame.getFileName();
    const lineNumber = functionCallStackFrame.getLineNumber();
    const columnNumber = functionCallStackFrame.getColumnNumber();
    if (fileName === null || lineNumber === null || columnNumber === null) {
        return;
    }
    let content = [];
    try {
        content = fs.readFileSync(fileName, 'utf8').split('\n');
    }
    catch {
        return;
    }
    let line = content[lineNumber - 1];
    if (!line) {
        // Exit if the line number couldn't be found
        return;
    }
    line = line.slice(columnNumber - 1);
    const match = labelRegex.exec(line);
    if (!((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.label)) {
        // Exit if we didn't find a label
        return;
    }
    const token = match.groups.label;
    if (is_valid_identifier_1.default(token) || is_valid_identifier_1.default(token.split('.').pop())) {
        return token;
    }
    return;
};
exports.inferLabel = inferLabel;
