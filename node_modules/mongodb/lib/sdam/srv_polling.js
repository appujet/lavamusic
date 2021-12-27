"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SrvPoller = exports.SrvPollingEvent = void 0;
const dns = require("dns");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const mongo_types_1 = require("../mongo_types");
const error_1 = require("../error");
/**
 * Determines whether a provided address matches the provided parent domain in order
 * to avoid certain attack vectors.
 *
 * @param srvAddress - The address to check against a domain
 * @param parentDomain - The domain to check the provided address against
 * @returns Whether the provided address matches the parent domain
 */
function matchesParentDomain(srvAddress, parentDomain) {
    const regex = /^.*?\./;
    const srv = `.${srvAddress.replace(regex, '')}`;
    const parent = `.${parentDomain.replace(regex, '')}`;
    return srv.endsWith(parent);
}
/**
 * @internal
 * @category Event
 */
class SrvPollingEvent {
    constructor(srvRecords) {
        this.srvRecords = srvRecords;
    }
    addresses() {
        return new Map(this.srvRecords.map(record => {
            const host = new utils_1.HostAddress(`${record.name}:${record.port}`);
            return [host.toString(), host];
        }));
    }
}
exports.SrvPollingEvent = SrvPollingEvent;
/** @internal */
class SrvPoller extends mongo_types_1.TypedEventEmitter {
    constructor(options) {
        super();
        if (!options || !options.srvHost) {
            throw new error_1.MongoRuntimeError('Options for SrvPoller must exist and include srvHost');
        }
        this.srvHost = options.srvHost;
        this.rescanSrvIntervalMS = 60000;
        this.heartbeatFrequencyMS = options.heartbeatFrequencyMS || 10000;
        this.logger = new logger_1.Logger('srvPoller', options);
        this.haMode = false;
        this.generation = 0;
        this._timeout = undefined;
    }
    get srvAddress() {
        return `_mongodb._tcp.${this.srvHost}`;
    }
    get intervalMS() {
        return this.haMode ? this.heartbeatFrequencyMS : this.rescanSrvIntervalMS;
    }
    start() {
        if (!this._timeout) {
            this.schedule();
        }
    }
    stop() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this.generation += 1;
            this._timeout = undefined;
        }
    }
    schedule() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => this._poll(), this.intervalMS);
    }
    success(srvRecords) {
        this.haMode = false;
        this.schedule();
        this.emit(SrvPoller.SRV_RECORD_DISCOVERY, new SrvPollingEvent(srvRecords));
    }
    failure(message, obj) {
        this.logger.warn(message, obj);
        this.haMode = true;
        this.schedule();
    }
    parentDomainMismatch(srvRecord) {
        this.logger.warn(`parent domain mismatch on SRV record (${srvRecord.name}:${srvRecord.port})`, srvRecord);
    }
    _poll() {
        const generation = this.generation;
        dns.resolveSrv(this.srvAddress, (err, srvRecords) => {
            if (generation !== this.generation) {
                return;
            }
            if (err) {
                this.failure('DNS error', err);
                return;
            }
            const finalAddresses = [];
            srvRecords.forEach((record) => {
                if (matchesParentDomain(record.name, this.srvHost)) {
                    finalAddresses.push(record);
                }
                else {
                    this.parentDomainMismatch(record);
                }
            });
            if (!finalAddresses.length) {
                this.failure('No valid addresses found at host');
                return;
            }
            this.success(finalAddresses);
        });
    }
}
exports.SrvPoller = SrvPoller;
/** @event */
SrvPoller.SRV_RECORD_DISCOVERY = 'srvRecordDiscovery';
//# sourceMappingURL=srv_polling.js.map