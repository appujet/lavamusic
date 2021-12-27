/**
 * @module Petitio
 */
import { HTTPMethod, PetitioRequest } from "./lib/PetitioRequest";
import { PetitioResponse } from "./lib/PetitioResponse";
import { URL } from "url";
declare const _default: (url: URL | string, method?: HTTPMethod) => PetitioRequest;
/**
 * @param {(string | URL)} url The URL to start composing a request for.
 * @param {HTTPMethod} [method="GET"] The HTTP method to use.
 * @return {PetitioRequest} The Petitio request instance for your URL.
 * @see [[PetitioRequest.constructor]]
 */
export = _default;
export { HTTPMethod, PetitioRequest, PetitioResponse };
