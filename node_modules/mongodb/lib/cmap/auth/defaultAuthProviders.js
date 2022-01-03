"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_PROVIDERS = exports.AuthMechanism = void 0;
const mongocr_1 = require("./mongocr");
const x509_1 = require("./x509");
const plain_1 = require("./plain");
const gssapi_1 = require("./gssapi");
const scram_1 = require("./scram");
const mongodb_aws_1 = require("./mongodb_aws");
/** @public */
exports.AuthMechanism = Object.freeze({
    MONGODB_AWS: 'MONGODB-AWS',
    MONGODB_CR: 'MONGODB-CR',
    MONGODB_DEFAULT: 'DEFAULT',
    MONGODB_GSSAPI: 'GSSAPI',
    MONGODB_PLAIN: 'PLAIN',
    MONGODB_SCRAM_SHA1: 'SCRAM-SHA-1',
    MONGODB_SCRAM_SHA256: 'SCRAM-SHA-256',
    MONGODB_X509: 'MONGODB-X509'
});
exports.AUTH_PROVIDERS = new Map([
    [exports.AuthMechanism.MONGODB_AWS, new mongodb_aws_1.MongoDBAWS()],
    [exports.AuthMechanism.MONGODB_CR, new mongocr_1.MongoCR()],
    [exports.AuthMechanism.MONGODB_GSSAPI, new gssapi_1.GSSAPI()],
    [exports.AuthMechanism.MONGODB_PLAIN, new plain_1.Plain()],
    [exports.AuthMechanism.MONGODB_SCRAM_SHA1, new scram_1.ScramSHA1()],
    [exports.AuthMechanism.MONGODB_SCRAM_SHA256, new scram_1.ScramSHA256()],
    [exports.AuthMechanism.MONGODB_X509, new x509_1.X509()]
]);
//# sourceMappingURL=defaultAuthProviders.js.map