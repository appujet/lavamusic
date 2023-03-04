import { fetch } from 'undici'
import { Tracks } from '../Tracks.js'
const BASE_URL = 'https://api.spotify.com/v1';
const REGEX = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album|artist)[\/:]([A-Za-z0-9]+)/;


export default class Spotify {
    public shoukaku: any;
    public client: any;
    public client_id: string;
    public client_secret: string;
    public token: string;
    public authorizations: string;
    public nextRefresh: any;
    public methods: {
        track: (id: any, requester: any) => Promise<{
            tracks: any[];
        }>;
        playlist: (id: any, requester: any) => Promise<{
            tracks: any[];
            name: any;
        }>;
        artist: (id: any, requester: any) => Promise<{
            tracks: any[];
        }>;
    }
    constructor(client: { client: any; }) {
        this.shoukaku = client;
        this.client = client.client;
        this.client_id = this.client.config.SpotifyID
        this.client_secret = this.client.config.SpotifySecret
        this.token = '';
        this.authorizations = `Basic ${Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64')}`;
        this.nextRefresh = '';
        this.methods = {
            track: this.getTrack.bind(this),
            playlist: this.getPlaylist.bind(this),
            artist: this.getArtist.bind(this),
        }
    }
    public checkURL(url: string) {
        return REGEX.test(url);
    }
    public async makeRequest(endpoint: string): Promise<any> {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        const data = await res.json();
        return data
    }
    public async refresh() {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: this.authorizations,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        const data = await res.json() as any;
        this.token = data.access_token;
        this.nextRefresh = Date.now() + data.expires_in;
    }
    public async getTrack(id: any, requester: any) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`tracks/${id}`);
        return { tracks: [this.buildTrack(data, requester)] }
    }
    public async getPlaylist(id: any, requester: any) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`playlists/${id}?market=US`) as any;
        const tracks = data.tracks.items.filter(this.filterNullOrUndefined).map((track: { track: any; }) => this.buildTrack(track.track, data.images[0]?.url));
        if (data && tracks.length) {
            let next = data.tracks.next;
            let page = 1;
            while (next && page < 5) {
                page++;
                const nextTracks = await this.makeRequest(next ?? '') as any;
                if (nextTracks.items.length) {
                    next = nextTracks.next;
                    tracks.push(...nextTracks.items.filter(this.filterNullOrUndefined).filter((a: { track: any; }) => a.track).map((track: { track: any; }) => this.buildTrack(track?.track, data.images[0]?.url)),
                    );
                }
            }
        }
        return { tracks, name: data.name };
    }
    public async getArtist(id: any) {
        if (Date.now() >= this.nextRefresh) await this.refresh();
        const data = await this.makeRequest(`artists/${id}`);
        const fetchedTracks = await this.makeRequest(`artists/${id}/top-tracks?country=US`);
        const tracks = fetchedTracks.tracks.filter(this.filterNullOrUndefined).map((track: any) => this.buildTrack(track, data.images[0]?.url));
        return { tracks, name: data.name };
    }
    public async resolve(url: string, options: { requester: any; }) {
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

    public buildTrack(track: any, thumbnail: any) {
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
            },
        },
            this.shoukaku
        );
    }
    public buildSearch(playlistInfo: any, tracks: any[], loadType: string) {
        return {
            loadType: loadType ? loadType : 'NO_MATCHES',
            playlistInfo: {
                name: playlistInfo,
                selectedTrack: 0,
            },
            tracks,
        };
    }

    filterNullOrUndefined(obj: any) {
        return obj !== undefined && obj !== null;
    }
};


/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */