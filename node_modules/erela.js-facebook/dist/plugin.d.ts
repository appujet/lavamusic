import { Manager, Plugin, UnresolvedTrack, UnresolvedQuery } from "erela.js";
export declare class Facebook extends Plugin {
    private _search;
    private manager;
    private readonly options;
    constructor();
    load(manager: Manager): void;
    private search;
}
export interface Result {
    tracks: UnresolvedQuery[];
    name?: string;
}
export interface Options {
    /**
     * Whether to convert UnresolvedTracks to Track. Defaults to false.
     * **Note: This is** ***not*** **recommended as it spams YouTube and takes a while if a large playlist is loaded.**
     */
    convertUnresolved?: boolean;
}
export interface SearchResult {
    exception?: {
        severity: string;
        message: string;
    };
    loadType: string;
    playlist?: {
        duration: number;
        name: string;
    };
    tracks: UnresolvedTrack[];
}
