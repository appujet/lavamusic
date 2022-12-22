import { fetch } from 'undici'
import { Tracks } from '../Tracks.js'
const BASE_URL = 'https://api.spotify.com/v1';
const REGEX = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album|artist)[\/:]([A-Za-z0-9]+)/;


export default class Spotify {
    /**
     * 
     * @param {import('../Shoukaku.js').ShoukakuClient} client
     */
    constructor(client) {
        this.shoukaku = client;
        this.client = client.client;
        this.client_id = this.client.config.SpotifyID
        this.client_secret = this.client.config.SpotifySecret
        this.token = '';
        this.authorizations = `Basic ${Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64')}`;
        this.nextRefresh = '';
        this.methods = {
            track: this.getTrack.bind(this),
            album: this.getAlbum.bind(this),
            playlist: this.getPlaylist.bind(this),
            artist: this.getArtist.bind(this),
        }
    }
    checkURL(url) {
        return REGEX.test(url);
    }
    async makeRequest(endpoint) {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        const data = await res.json();
        return data
    }
    async refresh() {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: this.authorizations,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        const data = await res.json();
        this.token = data.access_token;
        this.nextRefresh = Date.now() + data.expires_in;
    }
    async getTrack(id, requester) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`tracks/${id}`);
        return { tracks: [this.buildTrack(data, requester)] }
    }
    async getAlbum(id, requester) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`albums/${id}`);
        const tracks = data.tracks.items.filter(this.filterNullOrUndefined).map((track) => this.buildTrack(track, requester));
        if (album && tracks.length) {
            let next = album.tracks.next;
            let page = 1;
            while (next && page < 5) {
                page++;
                if (nextTracks.items.length) {
                    next = nextTracks.next;
                    tracks.push(...nextTracks.items.filter(this.filterNullOrUndefined).filter((a) => a.track).map((track) => this.buildTrack(track?.track, requester, album.images[0]?.url)),
                    );
                }
            }
        }

        return { tracks, name: album.name };
    }
    async getPlaylist(id, requester) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`playlists/${id}?market=US`);
        const tracks = data.tracks.items.filter(this.filterNullOrUndefined).map((track) => this.buildTrack(track.track, requester, data.images[0]?.url));
        if (data && tracks.length) {
            let next = data.tracks.next;
            let page = 1;
            while (next && page < 5) {
                page++;
                const nextTracks = await this.makeRequest(next ?? '');
                if (nextTracks.items.length) {
                    next = nextTracks.next;
                    tracks.push(...nextTracks.items.filter(this.filterNullOrUndefined).filter((a) => a.track).map((track) => this.buildTrack(track?.track, requester, data.images[0]?.url)),
                    );
                }
            }
        }
        return { tracks, name: data.name };
    }
    async getArtist(id) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`artists/${id}`);
        const fetchedTracks = await this.makeRequest(`artists/${id}/top-tracks?country=US`);
        const tracks = fetchedTracks.tracks.filter(this.filterNullOrUndefined).map((track) => this.buildTrack(track, requester, data.images[0]?.url));
        return { tracks, name: data.name };
    }
    async resolve(url, options) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const [, types, id] = REGEX.exec(url) || [];
        if (!types || !id) return null;
        if (types in this.methods) {
            try {
                const _function = this.methods[types];
                const data = await _function(id, options?.requester);
                const loadType = types === 'track' ? 'TRACK_LOADED' : 'PLAYLIST_LOADED';
                const playlistName = data.name || 'unknown';
                const tracks = data.tracks.filter(this.filterNullOrUndefined);
                return this.buildSearch(playlistName, tracks, loadType);
            } catch (e) {
                return this.buildSearch(undefined, [], 'NO_MATCHES');
            }
        }
    }

    buildTrack(track, requester, thumbnail) {
        return new Tracks({
            track: '',
            info: {
                identifier: track.id,
                isSeekable: true,
                author: track.artists[0]?.name || "Unknown Artist",
                length: track.duration_ms,
                isStream: false,
                sourceName: "spotify",
                title: track.name,
                uri: `https://open.spotify.com/track/${track.id}`,
                thumbnail: thumbnail ? thumbnail : track.album.images[0]?.url,
            }
        },
            this.shoukaku, requester,
        );
    }
    buildSearch(playlistInfo, tracks, loadType) {
        return {
            loadType: loadType ? loadType : 'NO_MATCHES',
            playlistInfo: {
                name: playlistInfo,
                selectedTrack: 0,
            },
            tracks,
        };
    }

    filterNullOrUndefined(obj) {
        return obj !== undefined && obj !== null;
    }
}
