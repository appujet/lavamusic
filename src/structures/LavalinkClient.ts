import { LavalinkManager, type SearchResult, type SearchPlatform } from "lavalink-client";
import type Lavamusic from "./Lavamusic";
import { requesterTransformer } from "../utils/functions/player";

export default class LavalinkClient extends LavalinkManager {
    public client: Lavamusic;
    constructor(client: Lavamusic) {
        super({
            nodes: JSON.parse(client.env.NODES),
            sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
            queueOptions: {
                maxPreviousTracks: 25,
            },
            playerOptions: {
                defaultSearchPlatform: client.env.SEARCH_ENGINE,
                onDisconnect: {
                    destroyPlayer: true,
                },
                requesterTransformer: requesterTransformer,
                onEmptyQueue: {
                    //autoPlayFunction,
                },
            },
        });
        this.client = client;
    }
    /**
     * Searches for a song and returns the tracks.
     * @param query The query to search for.
     * @param user The user who requested the search.
     * @param source The source to search in. Defaults to youtube.
     * @returns An array of tracks that match the query.
     */
    public async search(query: string, user: unknown, source?: SearchPlatform): Promise<SearchResult> {
        const nodes = this.nodeManager.leastUsedNodes();
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        const result = await node.search({ query, source }, user, false);
        return result;
    }
}
