"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTopologyVersion = exports.parseServerType = exports.ServerDescription = void 0;
const utils_1 = require("../utils");
const common_1 = require("./common");
const bson_1 = require("../bson");
const WRITABLE_SERVER_TYPES = new Set([
    common_1.ServerType.RSPrimary,
    common_1.ServerType.Standalone,
    common_1.ServerType.Mongos,
    common_1.ServerType.LoadBalancer
]);
const DATA_BEARING_SERVER_TYPES = new Set([
    common_1.ServerType.RSPrimary,
    common_1.ServerType.RSSecondary,
    common_1.ServerType.Mongos,
    common_1.ServerType.Standalone,
    common_1.ServerType.LoadBalancer
]);
/**
 * The client's view of a single server, based on the most recent ismaster outcome.
 *
 * Internal type, not meant to be directly instantiated
 * @public
 */
class ServerDescription {
    /**
     * Create a ServerDescription
     * @internal
     *
     * @param address - The address of the server
     * @param ismaster - An optional ismaster response for this server
     */
    constructor(address, ismaster, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (typeof address === 'string') {
            this._hostAddress = new utils_1.HostAddress(address);
            this.address = this._hostAddress.toString();
        }
        else {
            this._hostAddress = address;
            this.address = this._hostAddress.toString();
        }
        this.type = parseServerType(ismaster, options);
        this.hosts = (_b = (_a = ismaster === null || ismaster === void 0 ? void 0 : ismaster.hosts) === null || _a === void 0 ? void 0 : _a.map((host) => host.toLowerCase())) !== null && _b !== void 0 ? _b : [];
        this.passives = (_d = (_c = ismaster === null || ismaster === void 0 ? void 0 : ismaster.passives) === null || _c === void 0 ? void 0 : _c.map((host) => host.toLowerCase())) !== null && _d !== void 0 ? _d : [];
        this.arbiters = (_f = (_e = ismaster === null || ismaster === void 0 ? void 0 : ismaster.arbiters) === null || _e === void 0 ? void 0 : _e.map((host) => host.toLowerCase())) !== null && _f !== void 0 ? _f : [];
        this.tags = (_g = ismaster === null || ismaster === void 0 ? void 0 : ismaster.tags) !== null && _g !== void 0 ? _g : {};
        this.minWireVersion = (_h = ismaster === null || ismaster === void 0 ? void 0 : ismaster.minWireVersion) !== null && _h !== void 0 ? _h : 0;
        this.maxWireVersion = (_j = ismaster === null || ismaster === void 0 ? void 0 : ismaster.maxWireVersion) !== null && _j !== void 0 ? _j : 0;
        this.roundTripTime = (_k = options === null || options === void 0 ? void 0 : options.roundTripTime) !== null && _k !== void 0 ? _k : -1;
        this.lastUpdateTime = (0, utils_1.now)();
        this.lastWriteDate = (_m = (_l = ismaster === null || ismaster === void 0 ? void 0 : ismaster.lastWrite) === null || _l === void 0 ? void 0 : _l.lastWriteDate) !== null && _m !== void 0 ? _m : 0;
        if (options === null || options === void 0 ? void 0 : options.topologyVersion) {
            this.topologyVersion = options.topologyVersion;
        }
        else if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.topologyVersion) {
            this.topologyVersion = ismaster.topologyVersion;
        }
        if (options === null || options === void 0 ? void 0 : options.error) {
            this.error = options.error;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.primary) {
            this.primary = ismaster.primary;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.me) {
            this.me = ismaster.me.toLowerCase();
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.setName) {
            this.setName = ismaster.setName;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.setVersion) {
            this.setVersion = ismaster.setVersion;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.electionId) {
            this.electionId = ismaster.electionId;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.logicalSessionTimeoutMinutes) {
            this.logicalSessionTimeoutMinutes = ismaster.logicalSessionTimeoutMinutes;
        }
        if (ismaster === null || ismaster === void 0 ? void 0 : ismaster.$clusterTime) {
            this.$clusterTime = ismaster.$clusterTime;
        }
    }
    get hostAddress() {
        if (this._hostAddress)
            return this._hostAddress;
        else
            return new utils_1.HostAddress(this.address);
    }
    get allHosts() {
        return this.hosts.concat(this.arbiters).concat(this.passives);
    }
    /** Is this server available for reads*/
    get isReadable() {
        return this.type === common_1.ServerType.RSSecondary || this.isWritable;
    }
    /** Is this server data bearing */
    get isDataBearing() {
        return DATA_BEARING_SERVER_TYPES.has(this.type);
    }
    /** Is this server available for writes */
    get isWritable() {
        return WRITABLE_SERVER_TYPES.has(this.type);
    }
    get host() {
        const chopLength = `:${this.port}`.length;
        return this.address.slice(0, -chopLength);
    }
    get port() {
        const port = this.address.split(':').pop();
        return port ? Number.parseInt(port, 10) : 27017;
    }
    /**
     * Determines if another `ServerDescription` is equal to this one per the rules defined
     * in the {@link https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#serverdescription|SDAM spec}
     */
    equals(other) {
        const topologyVersionsEqual = this.topologyVersion === other.topologyVersion ||
            compareTopologyVersion(this.topologyVersion, other.topologyVersion) === 0;
        const electionIdsEqual = this.electionId && other.electionId
            ? other.electionId && this.electionId.equals(other.electionId)
            : this.electionId === other.electionId;
        return (other != null &&
            (0, utils_1.errorStrictEqual)(this.error, other.error) &&
            this.type === other.type &&
            this.minWireVersion === other.minWireVersion &&
            (0, utils_1.arrayStrictEqual)(this.hosts, other.hosts) &&
            tagsStrictEqual(this.tags, other.tags) &&
            this.setName === other.setName &&
            this.setVersion === other.setVersion &&
            electionIdsEqual &&
            this.primary === other.primary &&
            this.logicalSessionTimeoutMinutes === other.logicalSessionTimeoutMinutes &&
            topologyVersionsEqual);
    }
}
exports.ServerDescription = ServerDescription;
// Parses an `ismaster` message and determines the server type
function parseServerType(ismaster, options) {
    if (options === null || options === void 0 ? void 0 : options.loadBalanced) {
        return common_1.ServerType.LoadBalancer;
    }
    if (!ismaster || !ismaster.ok) {
        return common_1.ServerType.Unknown;
    }
    if (ismaster.isreplicaset) {
        return common_1.ServerType.RSGhost;
    }
    if (ismaster.msg && ismaster.msg === 'isdbgrid') {
        return common_1.ServerType.Mongos;
    }
    if (ismaster.setName) {
        if (ismaster.hidden) {
            return common_1.ServerType.RSOther;
        }
        else if (ismaster.ismaster || ismaster.isWritablePrimary) {
            return common_1.ServerType.RSPrimary;
        }
        else if (ismaster.secondary) {
            return common_1.ServerType.RSSecondary;
        }
        else if (ismaster.arbiterOnly) {
            return common_1.ServerType.RSArbiter;
        }
        else {
            return common_1.ServerType.RSOther;
        }
    }
    return common_1.ServerType.Standalone;
}
exports.parseServerType = parseServerType;
function tagsStrictEqual(tags, tags2) {
    const tagsKeys = Object.keys(tags);
    const tags2Keys = Object.keys(tags2);
    return (tagsKeys.length === tags2Keys.length &&
        tagsKeys.every((key) => tags2[key] === tags[key]));
}
/**
 * Compares two topology versions.
 *
 * @returns A negative number if `lhs` is older than `rhs`; positive if `lhs` is newer than `rhs`; 0 if they are equivalent.
 */
function compareTopologyVersion(lhs, rhs) {
    if (lhs == null || rhs == null) {
        return -1;
    }
    if (lhs.processId.equals(rhs.processId)) {
        // tests mock counter as just number, but in a real situation counter should always be a Long
        const lhsCounter = bson_1.Long.isLong(lhs.counter) ? lhs.counter : bson_1.Long.fromNumber(lhs.counter);
        const rhsCounter = bson_1.Long.isLong(rhs.counter) ? lhs.counter : bson_1.Long.fromNumber(rhs.counter);
        return lhsCounter.compare(rhsCounter);
    }
    return -1;
}
exports.compareTopologyVersion = compareTopologyVersion;
//# sourceMappingURL=server_description.js.map