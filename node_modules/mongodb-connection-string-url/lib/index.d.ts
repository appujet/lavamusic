import { URL } from 'whatwg-url';
declare class CaseInsensitiveMap extends Map<string, string> {
    delete(name: any): boolean;
    get(name: any): string | undefined;
    has(name: any): boolean;
    set(name: any, value: any): this;
    _normalizeKey(name: any): string;
}
declare abstract class URLWithoutHost extends URL {
    abstract get host(): never;
    abstract set host(value: never);
    abstract get hostname(): never;
    abstract set hostname(value: never);
    abstract get port(): never;
    abstract set port(value: never);
    abstract get href(): string;
    abstract set href(value: string);
}
export default class ConnectionString extends URLWithoutHost {
    _hosts: string[];
    constructor(uri: string);
    get host(): never;
    set host(_ignored: never);
    get hostname(): never;
    set hostname(_ignored: never);
    get port(): never;
    set port(_ignored: never);
    get href(): string;
    set href(_ignored: string);
    get isSRV(): boolean;
    get hosts(): string[];
    set hosts(list: string[]);
    toString(): string;
    clone(): ConnectionString;
}
export declare class CommaAndColonSeparatedRecord extends CaseInsensitiveMap {
    constructor(from?: string | null);
    toString(): string;
}
export {};
