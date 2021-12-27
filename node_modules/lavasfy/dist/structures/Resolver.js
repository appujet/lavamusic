"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const Util_1 = __importDefault(require("../Util"));
class Resolver {
    constructor(node) {
        this.node = node;
        this.client = this.node.client;
        this.cache = new Map();
    }
    get token() {
        return this.client.token;
    }
    get playlistLoadLimit() {
        return this.client.options.playlistLoadLimit;
    }
    get autoResolve() {
        return this.client.options.autoResolve;
    }
    async getAlbum(id) {
        var _a, _b, _c, _d;
        try {
            if (!this.token)
                throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyAlbum } = await node_superfetch_1.default
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token);
            const unresolvedAlbumTracks = (_a = spotifyAlbum === null || spotifyAlbum === void 0 ? void 0 : spotifyAlbum.tracks.items.map(track => this.buildUnresolved(track))) !== null && _a !== void 0 ? _a : [];
            return this.buildResponse("PLAYLIST_LOADED", this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map(x => x.resolve()))).filter(Boolean) : unresolvedAlbumTracks, spotifyAlbum.name);
        }
        catch (e) {
            return this.buildResponse(((_b = e.body) === null || _b === void 0 ? void 0 : _b.error.message) === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, (_d = (_c = e.body) === null || _c === void 0 ? void 0 : _c.error.message) !== null && _d !== void 0 ? _d : e.message);
        }
    }
    async getPlaylist(id) {
        var _a, _b;
        try {
            if (!this.token)
                throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyPlaylist } = await node_superfetch_1.default
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token);
            await this.getPlaylistTracks(spotifyPlaylist);
            const unresolvedPlaylistTracks = spotifyPlaylist.tracks.items.map(x => this.buildUnresolved(x.track));
            return this.buildResponse("PLAYLIST_LOADED", this.autoResolve ? (await Promise.all(unresolvedPlaylistTracks.map(x => x.resolve()))).filter(Boolean) : unresolvedPlaylistTracks, spotifyPlaylist.name);
        }
        catch (e) {
            return this.buildResponse(e.status === 404 ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, (_b = (_a = e.body) === null || _a === void 0 ? void 0 : _a.error.message) !== null && _b !== void 0 ? _b : e.message);
        }
    }
    async getTrack(id) {
        var _a, _b, _c;
        try {
            if (!this.token)
                throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyTrack } = await node_superfetch_1.default
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token);
            const unresolvedTrack = this.buildUnresolved(spotifyTrack);
            return this.buildResponse("TRACK_LOADED", this.autoResolve ? [await unresolvedTrack.resolve()] : [unresolvedTrack]);
        }
        catch (e) {
            return this.buildResponse(((_a = e.body) === null || _a === void 0 ? void 0 : _a.error.message) === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, (_c = (_b = e.body) === null || _b === void 0 ? void 0 : _b.error.message) !== null && _c !== void 0 ? _c : e.message);
        }
    }
    async getPlaylistTracks(spotifyPlaylist) {
        let nextPage = spotifyPlaylist.tracks.next;
        let pageLoaded = 1;
        while (nextPage && (this.playlistLoadLimit === 0 ? true : pageLoaded < this.playlistLoadLimit)) {
            // @ts-expect-error 2322
            const { body: spotifyPlaylistPage } = await node_superfetch_1.default
                .get(nextPage)
                .set("Authorization", this.token);
            spotifyPlaylist.tracks.items.push(...spotifyPlaylistPage.items);
            nextPage = spotifyPlaylistPage.next;
            pageLoaded++;
        }
    }
    async resolve(unresolvedTrack) {
        const cached = this.cache.get(unresolvedTrack.info.identifier);
        if (cached)
            return Util_1.default.structuredClone(cached);
        const lavaTrack = await this.retrieveTrack(unresolvedTrack);
        if (lavaTrack) {
            if (this.client.options.useSpotifyMetadata) {
                Object.assign(lavaTrack.info, {
                    title: unresolvedTrack.info.title,
                    author: unresolvedTrack.info.author,
                    uri: unresolvedTrack.info.uri
                });
            }
            this.cache.set(unresolvedTrack.info.identifier, Object.freeze(lavaTrack));
        }
        return Util_1.default.structuredClone(lavaTrack);
    }
    async retrieveTrack(unresolvedTrack) {
        const params = new URLSearchParams({
            identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
        });
        // @ts-expect-error 2322
        const { body: response } = await node_superfetch_1.default
            .get(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
            .set("Authorization", this.node.password);
        return response.tracks[0];
    }
    buildUnresolved(spotifyTrack) {
        const _this = this; // eslint-disable-line
        return {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists.map(x => x.name).join(", "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve() {
                return _this.resolve(this);
            }
        };
    }
    buildResponse(loadType, tracks = [], playlistName, exceptionMsg) {
        return Object.assign({
            loadType,
            tracks,
            playlistInfo: playlistName ? { name: playlistName } : {}
        }, exceptionMsg ? { exception: { message: exceptionMsg, severity: "COMMON" } } : {});
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFrQixDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFXLFdBQVc7UUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFZLENBQUM7SUFDNUMsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBVTs7UUFDNUIsSUFBSTtZQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDN0Qsd0JBQXdCO1lBQ3hCLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQTJCLE1BQU0seUJBQU87aUJBQy9ELEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV0QyxNQUFNLHFCQUFxQixHQUFHLE1BQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLE1BQU0sQ0FBQyxLQUFL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