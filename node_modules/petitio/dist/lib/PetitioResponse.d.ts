/**
 * @module PetitioResponse
 */
/// <reference types="node" />
export declare class PetitioResponse {
    /**
     * The response body received from the server.
     * This is updated through [[PetitioResponse._addBody]], either
     * from [[PetitioRequest.send]] or directly on a response object from
     * another source.
     */
    body: Buffer;
    /**
     * The response headers received from the server.
     * This is updated through [[PetitioResponse._parseHeaders]].
     */
    headers: {
        [k: string]: any;
    };
    /**
     * The status code received from the server.
     * This is set only after the response is complete when headers are received
     * or it can be set manually.
     */
    statusCode: number | null;
    /**
     * This takes the data chunks and creates a Buffer, and it sets
     * that buffer as the body.
     * @param {*} chunks The body to set for the response.
     * @return {*} In place operation with no return.
     */
    _addBody(chunks: Buffer[] | Uint8Array[]): void;
    /**
     * @param {*} headers The headers to add. This is done by splitting the
     * array into chunks of two, where the first value becomes the header and
     * the latter becomes its value. This will also append values to the header
     * as an array if it already exists.
     * @return {*} In place operation with no return.
     */
    _parseHeaders(headers: string[]): void;
    /**
     * @template T Type casting parameter for the JSON result.
     * @param {BufferEncoding} [encoding="utf8"] The encoding to use when parsing the response body.
     * @return {T} A serialized object result parsed from the response body.
     */
    json<T = any>(encoding?: BufferEncoding): T;
    /**
     * @param {BufferEncoding} [encoding="utf8"] The encoding to use.
     * @return {string} The response body decoded as as a string from the buffer, using either the encoding specified in `encoding` or UTF-8 by default..
     */
    text(encoding?: BufferEncoding): string;
}
