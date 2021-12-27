import LavasfyClient from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: LavasfyClient;
    resolver: Resolver;
    id: string;
    host: string;
    port: number | string;
    password: string;
    secure: boolean;
    private readonly methods;
    constructor(client: LavasfyClient, options: NodeOptions);
    /**
     * A method for loading Spotify URLs
     * @returns Lavalink-like /loadtracks response
     */
    load(url: string): Promise<LavalinkTrackResponse>;
}
