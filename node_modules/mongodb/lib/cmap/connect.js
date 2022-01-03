"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGAL_TCP_SOCKET_OPTIONS = exports.LEGAL_TLS_SOCKET_OPTIONS = exports.connect = void 0;
const net = require("net");
const tls = require("tls");
const connection_1 = require("./connection");
const error_1 = require("../error");
const defaultAuthProviders_1 = require("./auth/defaultAuthProviders");
const auth_provider_1 = require("./auth/auth_provider");
const utils_1 = require("../utils");
const constants_1 = require("./wire_protocol/constants");
const bson_1 = require("../bson");
const FAKE_MONGODB_SERVICE_ID = typeof process.env.FAKE_MONGODB_SERVICE_ID === 'string' &&
    process.env.FAKE_MONGODB_SERVICE_ID.toLowerCase() === 'true';
function connect(options, callback) {
    makeConnection(options, (err, socket) => {
        var _a;
        if (err || !socket) {
            return callback(err);
        }
        let ConnectionType = (_a = options.connectionType) !== null && _a !== void 0 ? _a : connection_1.Connection;
        if (options.autoEncrypter) {
            ConnectionType = connection_1.CryptoConnection;
        }
        performInitialHandshake(new ConnectionType(socket, options), options, callback);
    });
}
exports.connect = connect;
function checkSupportedServer(ismaster, options) {
    var _a;
    const serverVersionHighEnough = ismaster &&
        (typeof ismaster.maxWireVersion === 'number' || ismaster.maxWireVersion instanceof bson_1.Int32) &&
        ismaster.maxWireVersion >= constants_1.MIN_SUPPORTED_WIRE_VERSION;
    const serverVersionLowEnough = ismaster &&
        (typeof ismaster.minWireVersion === 'number' || ismaster.minWireVersion instanceof bson_1.Int32) &&
        ismaster.minWireVersion <= constants_1.MAX_SUPPORTED_WIRE_VERSION;
    if (serverVersionHighEnough) {
        if (serverVersionLowEnough) {
            return null;
        }
        const message = `Server at ${options.hostAddress} reports minimum wire version ${JSON.stringify(ismaster.minWireVersion)}, but this version of the Node.js Driver requires at most ${constants_1.MAX_SUPPORTED_WIRE_VERSION} (MongoDB ${constants_1.MAX_SUPPORTED_SERVER_VERSION})`;
        return new error_1.MongoCompatibilityError(message);
    }
    const message = `Server at ${options.hostAddress} reports maximum wire version ${(_a = JSON.stringify(ismaster.maxWireVersion)) !== null && _a !== void 0 ? _a : 0}, but this version of the Node.js Driver requires at least ${constants_1.MIN_SUPPORTED_WIRE_VERSION} (MongoDB ${constants_1.MIN_SUPPORTED_SERVER_VERSION})`;
    return new error_1.MongoCompatibilityError(message);
}
function performInitialHandshake(conn, options, _callback) {
    const callback = function (err, ret) {
        if (err && conn) {
            conn.destroy();
        }
        _callback(err, ret);
    };
    const credentials = options.credentials;
    if (credentials) {
        if (!(credentials.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_DEFAULT) &&
            !defaultAuthProviders_1.AUTH_PROVIDERS.get(credentials.mechanism)) {
            callback(new error_1.MongoInvalidArgumentError(`AuthMechanism '${credentials.mechanism}' not supported`));
            return;
        }
    }
    const authContext = new auth_provider_1.AuthContext(conn, credentials, options);
    prepareHandshakeDocument(authContext, (err, handshakeDoc) => {
        if (err || !handshakeDoc) {
            return callback(err);
        }
        const handshakeOptions = Object.assign({}, options);
        if (typeof options.connectTimeoutMS === 'number') {
            // The handshake technically is a monitoring check, so its socket timeout should be connectTimeoutMS
            handshakeOptions.socketTimeoutMS = options.connectTimeoutMS;
        }
        const start = new Date().getTime();
        conn.command((0, utils_1.ns)('admin.$cmd'), handshakeDoc, handshakeOptions, (err, response) => {
            if (err) {
                callback(err);
                return;
            }
            if ((response === null || response === void 0 ? void 0 : response.ok) === 0) {
                callback(new error_1.MongoServerError(response));
                return;
            }
            if ('isWritablePrimary' in response) {
                // Provide pre-hello-style response document.
                response.ismaster = response.isWritablePrimary;
            }
            if (response.helloOk) {
                conn.helloOk = true;
            }
            const supportedServerErr = checkSupportedServer(response, options);
            if (supportedServerErr) {
                callback(supportedServerErr);
                return;
            }
            if (options.loadBalanced) {
                // TODO: Durran: Remove when server support exists. (NODE-3431)
                if (FAKE_MONGODB_SERVICE_ID) {
                    response.serviceId = response.topologyVersion.processId;
                }
                if (!response.serviceId) {
                    return callback(new error_1.MongoCompatibilityError('Driver attempted to initialize in load balancing mode, ' +
                        'but the server does not support this mode.'));
                }
            }
            // NOTE: This is metadata attached to the connection while porting away from
            //       handshake being done in the `Server` class. Likely, it should be
            //       relocated, or at very least restructured.
            conn.ismaster = response;
            conn.lastIsMasterMS = new Date().getTime() - start;
            if (!response.arbiterOnly && credentials) {
                // store the response on auth context
                authContext.response = response;
                const resolvedCredentials = credentials.resolveAuthMechanism(response);
                const provider = defaultAuthProviders_1.AUTH_PROVIDERS.get(resolvedCredentials.mechanism);
                if (!provider) {
                    return callback(new error_1.MongoInvalidArgumentError(`No AuthProvider for ${resolvedCredentials.mechanism} defined.`));
                }
                provider.auth(authContext, err => {
                    if (err)
                        return callback(err);
                    callback(undefined, conn);
                });
                return;
            }
            callback(undefined, conn);
        });
    });
}
function prepareHandshakeDocument(authContext, callback) {
    const options = authContext.options;
    const compressors = options.compressors ? options.compressors : [];
    const { serverApi } = authContext.connection;
    const handshakeDoc = {
        [(serverApi === null || serverApi === void 0 ? void 0 : serverApi.version) ? 'hello' : 'ismaster']: true,
        helloOk: true,
        client: options.metadata || (0, utils_1.makeClientMetadata)(options),
        compression: compressors,
        loadBalanced: options.loadBalanced
    };
    const credentials = authContext.credentials;
    if (credentials) {
        if (credentials.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_DEFAULT && credentials.username) {
            handshakeDoc.saslSupportedMechs = `${credentials.source}.${credentials.username}`;
            const provider = defaultAuthProviders_1.AUTH_PROVIDERS.get(defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA256);
            if (!provider) {
                // This auth mechanism is always present.
                return callback(new error_1.MongoInvalidArgumentError(`No AuthProvider for ${defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA256} defined.`));
            }
            return provider.prepare(handshakeDoc, authContext, callback);
        }
        const provider = defaultAuthProviders_1.AUTH_PROVIDERS.get(credentials.mechanism);
        if (!provider) {
            return callback(new error_1.MongoInvalidArgumentError(`No AuthProvider for ${credentials.mechanism} defined.`));
        }
        return provider.prepare(handshakeDoc, authContext, callback);
    }
    callback(undefined, handshakeDoc);
}
/** @public */
exports.LEGAL_TLS_SOCKET_OPTIONS = [
    'ALPNProtocols',
    'ca',
    'cert',
    'checkServerIdentity',
    'ciphers',
    'crl',
    'ecdhCurve',
    'key',
    'minDHSize',
    'passphrase',
    'pfx',
    'rejectUnauthorized',
    'secureContext',
    'secureProtocol',
    'servername',
    'session'
];
/** @public */
exports.LEGAL_TCP_SOCKET_OPTIONS = [
    'family',
    'hints',
    'localAddress',
    'localPort',
    'lookup'
];
function parseConnectOptions(options) {
    const hostAddress = options.hostAddress;
    if (!hostAddress)
        throw new error_1.MongoInvalidArgumentError('Option "hostAddress" is required');
    const result = {};
    for (const name of exports.LEGAL_TCP_SOCKET_OPTIONS) {
        if (options[name] != null) {
            result[name] = options[name];
        }
    }
    if (typeof hostAddress.socketPath === 'string') {
        result.path = hostAddress.socketPath;
        return result;
    }
    else if (typeof hostAddress.host === 'string') {
        result.host = hostAddress.host;
        result.port = hostAddress.port;
        return result;
    }
    else {
        // This should never happen since we set up HostAddresses
        // But if we don't throw here the socket could hang until timeout
        // TODO(NODE-3483)
        throw new error_1.MongoRuntimeError(`Unexpected HostAddress ${JSON.stringify(hostAddress)}`);
    }
}
function parseSslOptions(options) {
    const result = parseConnectOptions(options);
    // Merge in valid SSL options
    for (const name of exports.LEGAL_TLS_SOCKET_OPTIONS) {
        if (options[name] != null) {
            result[name] = options[name];
        }
    }
    // Set default sni servername to be the same as host
    if (result.servername == null && result.host && !net.isIP(result.host)) {
        result.servername = result.host;
    }
    return result;
}
const SOCKET_ERROR_EVENT_LIST = ['error', 'close', 'timeout', 'parseError'];
const SOCKET_ERROR_EVENTS = new Set(SOCKET_ERROR_EVENT_LIST);
function makeConnection(options, _callback) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const useTLS = (_a = options.tls) !== null && _a !== void 0 ? _a : false;
    const keepAlive = (_b = options.keepAlive) !== null && _b !== void 0 ? _b : true;
    const socketTimeoutMS = (_d = (_c = options.socketTimeoutMS) !== null && _c !== void 0 ? _c : Reflect.get(options, 'socketTimeout')) !== null && _d !== void 0 ? _d : 0;
    const noDelay = (_e = options.noDelay) !== null && _e !== void 0 ? _e : true;
    const connectionTimeout = (_f = options.connectTimeoutMS) !== null && _f !== void 0 ? _f : 30000;
    const rejectUnauthorized = (_g = options.rejectUnauthorized) !== null && _g !== void 0 ? _g : true;
    const keepAliveInitialDelay = (_j = (((_h = options.keepAliveInitialDelay) !== null && _h !== void 0 ? _h : 120000) > socketTimeoutMS
        ? Math.round(socketTimeoutMS / 2)
        : options.keepAliveInitialDelay)) !== null && _j !== void 0 ? _j : 120000;
    let socket;
    const callback = function (err, ret) {
        if (err && socket) {
            socket.destroy();
        }
        _callback(err, ret);
    };
    if (useTLS) {
        const tlsSocket = tls.connect(parseSslOptions(options));
        if (typeof tlsSocket.disableRenegotiation === 'function') {
            tlsSocket.disableRenegotiation();
        }
        socket = tlsSocket;
    }
    else {
        socket = net.createConnection(parseConnectOptions(options));
    }
    socket.setKeepAlive(keepAlive, keepAliveInitialDelay);
    socket.setTimeout(connectionTimeout);
    socket.setNoDelay(noDelay);
    const connectEvent = useTLS ? 'secureConnect' : 'connect';
    let cancellationHandler;
    function errorHandler(eventName) {
        return (err) => {
            SOCKET_ERROR_EVENTS.forEach(event => socket.removeAllListeners(event));
            if (cancellationHandler && options.cancellationToken) {
                options.cancellationToken.removeListener('cancel', cancellationHandler);
            }
            socket.removeListener(connectEvent, connectHandler);
            callback(connectionFailureError(eventName, err));
        };
    }
    function connectHandler() {
        SOCKET_ERROR_EVENTS.forEach(event => socket.removeAllListeners(event));
        if (cancellationHandler && options.cancellationToken) {
            options.cancellationToken.removeListener('cancel', cancellationHandler);
        }
        if ('authorizationError' in socket) {
            if (socket.authorizationError && rejectUnauthorized) {
                return callback(socket.authorizationError);
            }
        }
        socket.setTimeout(socketTimeoutMS);
        callback(undefined, socket);
    }
    SOCKET_ERROR_EVENTS.forEach(event => socket.once(event, errorHandler(event)));
    if (options.cancellationToken) {
        cancellationHandler = errorHandler('cancel');
        options.cancellationToken.once('cancel', cancellationHandler);
    }
    socket.once(connectEvent, connectHandler);
}
function connectionFailureError(type, err) {
    switch (type) {
        case 'error':
            return new error_1.MongoNetworkError(err);
        case 'timeout':
            return new error_1.MongoNetworkTimeoutError('connection timed out');
        case 'close':
            return new error_1.MongoNetworkError('connection closed');
        case 'cancel':
            return new error_1.MongoNetworkError('connection establishment was cancelled');
        default:
            return new error_1.MongoNetworkError('unknown network error');
    }
}
//# sourceMappingURL=connect.js.map