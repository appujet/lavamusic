import Node from "./Node";
import { LavalinkTrack, LavalinkTrackResponse } from "../typings";
export default class Resolver {
    node: Node;
    client: import("..").LavasfyClient;
    cache: Map<string, LavalinkTrack>;
    constructor(node: Node);
    get token(): string;
    get playlistLoadLimit(): number;
    get autoResolve(): boolean;
    getAlbum(id: string): Promise<LavalinkTrackResponse>;
    getPlaylist(id: string): Promise<LavalinkTrackResponse>;
    getTrack(id: string): Promise<LavalinkTrackResponse>;
    private getPlaylistTracks;
    private resolve;
    private retrieveTrack;
    private buildUnresolved;
    private buildResponse;
}
