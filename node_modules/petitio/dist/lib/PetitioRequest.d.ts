/**
 * @module PetitioRequest
 */
/// <reference types="node" />
import type AbortController from "node-abort-controller";
import type ClientType from "undici/types/client";
import type { IncomingHttpHeaders } from "http";
import type { ParsedUrlQueryInput } from "querystring";
import { PetitioResponse } from "./PetitioResponse";
import type { Readable } from "stream";
import { URL } from "url";
/**
 * Accepted HTTP methods (currently only supports up to HTTP/1.1).
 */
export declare type HTTPMethod = "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH";
/**
 * @see [Undici ClientOptions timeout documentation](https://github.com/nodejs/undici/blob/main/docs/api/Client.md#parameter-clientoptions)
 */
export interface TimeoutOptions {
    bodyTimeout?: number;
    headersTimeout?: number;
    keepAliveTimeout?: number;
}
export declare class PetitioRequest {
    /**
     * Options to use for Undici under the hood.
     * @see [Undici ClientOptions documentation](https://github.com/nodejs/undici/blob/main/docs/api/Client.md#parameter-clientoptions)
     */
    coreOptions: ClientType.Options;
    /**
     * The data to be sent as the request body.
     * This will be a buffer or string for normal requests, or a stream.Readable
     * if the request is to be sent as a stream.
     */
    data?: Buffer | string | Readable;
    /**
     * @see [[HTTPMethod]]
     */
    httpMethod: HTTPMethod;
    /**
     * @see [[PetitioRequest.client]]
     */
    kClient?: ClientType;
    /**
     * Whether [[PetitioRequest.kClient]] will persist between [[PetitioRequest.send]]
     * calls. It is recommended to enable this for superior performance.
     */
    keepClient?: boolean;
    /**
     * The headers to attach to the request.
     */
    reqHeaders: IncomingHttpHeaders;
    /**
     * The timeout options for the Undici client.
     * @see [[TimeoutOptions]]
     */
    timeoutOptions: TimeoutOptions;
    /**
     * The URL destination for the request, targeted in [[PetitioRequest.send]].
     */
    url: URL;
    /**
     * The AbortController attached to the request
     * enableable with [[PetitioRequest.signal]]
     */
    controller?: AbortController;
    /**
     * @param {(string | URL)} url The URL to start composing a request for.
     * @param {HTTPMethod} [httpMethod="GET"] The HTTP method to use.
     * @return {PetitioRequest} The Petitio request instance for your URL.
     */
    constructor(url: string | URL, httpMethod?: HTTPMethod);
    /**
     * @param {ClientType} client The Undici client instance you wish to use.
     * @param {boolean} keepAlive Whether to persist the client across requests or not.
     * @return {*} The request object for further composition.
     * @see [Undici Client documentation](https://github.com/nodejs/undici/blob/main/docs/api/Client.md)
     */
    client(client: ClientType, keepAlive?: boolean): this;
    /**
     * @param {*} key The query key to use for the URL query parameters.
     * @param {*} value The value to set the query key to.
     * @example
     * If you wish to make a query at https://example.com/index?query=parameter
     * you can use `.query("query", "parameter")`.
     */
    query(key: string, value: any): this;
    /**
     * @param {*} key An object of query keys and their respective values.
     * @example
     * If you wish to make multiple queries at once, you can use
     * `.query({"keyOne": "hello", "keyTwo": "world!"})`.
     */
    query(key: Record<string, any>): this;
    /**
     * @param {string} relativePath A path to resolve relative to the current URL.
     * @return {*} The request object for further composition.
     * @example `https://example.org/hello/world` with `.path("../petitio")`
     * would resolve to `https://example.org/hello/petitio`.
     */
    path(relativePath: string): this;
    /**
     * @param {AbortController} controller A controller instance that handles aborting the request.
     * @return {*} The request object for further composition.
     * @example
     * ```ts
     * const controller = new AbortController();
     * const result = petitio(URL).signal(controller);
     * setTimeout(() => controller.abort(), 5000) // serves as a request timeout
     * ```
     */
    signal(controller: AbortController): this;
    /**
     * @param {*} data The data to be set for the request body.
     */
    body(data: Buffer | string): this;
    /**
     * @param {*} data The data to be set for the request body.
     * @param {*} sendAs If data is set to any object type value other than a
     * buffer or this is set to `json`, the `Content-Type` header will be set to
     * `application/json` and the request data will be set to the stringified
     * JSON form of the supplied data.
     */
    body(data: Record<string, any>, sendAs?: "json"): this;
    /**
     * @param {*} data The data to be set for the request body.
     * @param {*} sendAs If data is a string or a parsed object of query
     * parameters *AND* this is set to `form`, the `Content-Type` header will be
     * set to `application/x-www-form-urlencoded` and the request data will be
     * set to the URL encoded version of the query string.
     */
    body(data: ParsedUrlQueryInput | string, sendAs: "form"): this;
    /**
     * @param {*} data The data to be set for the request body.
     * @param {*} sendAs If data is a stream.Readable *AND* this is set to
     * `stream`, the body will be sent as the stream with no modifications to
     * it or the headers.
     */
    body(data: Readable, sendAs: "stream"): this;
    /**
     * @param {*} header The encoded header name to set.
     * @param {*} value The value to set the header to.
     */
    header(header: string, value: string): this;
    /**
     * @param {*} header An object of keys and values to set headers to.
     */
    header(header: Record<string, string>): this;
    /**
     * @param {*} method The HTTP method to change the request to.
     * @return {*} The request object for further composition.
     */
    method(method: HTTPMethod): this;
    /**
     * @param {*} timeout The timeout (in milliseconds) to set the `bodyTimeout`
     * to.
     * @see [[TimeoutOptions.bodyTimeout]]
     */
    timeout(timeout: number): this;
    /**
     * @param {*} timeout The timeout option to change.
     * @param {*} time The number of milliseconds to set the timeout to.
     * @see [[TimeoutOptions]]
     */
    timeout(timeout: keyof TimeoutOptions, time: number): this;
    /**
     * @param {*} key An object of key-value options to set for Undici.
     * @see [Undici Client documentation](https://github.com/nodejs/undici/blob/main/docs/api/Client.md)
     */
    option(key: ClientType.Options): this;
    /**
     * @template T
     * @param {T} key The client options key to set.
     * @param {ClientType.Options[T]} value The value to set the client option to (type checked).
     * @see [Undici Client documentation](https://github.com/nodejs/undici/blob/main/docs/api/Client.md)
     */
    option<T extends keyof ClientType.Options>(key: T, value: ClientType.Options[T]): this;
    /**
     * @template T Type casting parameter for the JSON result.
     * @return {*} A serialized object result from sending the request.
     */
    json<T = any>(): Promise<T>;
    /**
     * @return {*} The raw response body as a buffer.
     */
    raw(): Promise<Buffer>;
    /**
     * @return {*} The raw response body as a string.
     */
    text(): Promise<string>;
    /**
     * Finalizes and sends the composable request to the target server.
     * @return {@link PetitioRequest} The response object.
     * @throws {@link RequestAbortedError} Thrown when the request is aborted via
     * the abort controller.
     * @throws {@link ClientDestroyedError} Thrown when you attempt to use an
     * already destroyed Undici client to make another request.
     * @throws {@link ClientClosedError} Thrown when you attempt to use an
     * already closed Undici client to make another request.
     * @throws {@link HeadersTimeoutError} Thrown when request headers were not
     * received before the timeout expired.
     * @throws {@link BodyTimeoutError} Thrown when the request body was not
     * received before the timeout expired.
     */
    send(): Promise<PetitioResponse>;
}
