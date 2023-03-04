import { Track, Shoukaku } from 'shoukaku';
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class Tracks {
    public track: Track[];
    public info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri: string;
        sourceName: string;
        thumbnail: string;
    } | any;
    public shoukaku: Shoukaku;
    constructor(data: any, shoukaku: Shoukaku) {
        this.track = data.track;
        this.info = {
            identifier: data.info.identifier,
            isSeekable: data.info.isSeekable,
            author: data.info.author,
            length: data.info.length,
            isStream: data.info.isStream,
            sourceName: data.info.sourceName,
            title: data.info.title,
            uri: data.info.uri,
            thumbnail: data.info.thumbnail || null,
        }
        this.shoukaku = shoukaku;
        if (!this.track) this.resolve(shoukaku);
    }

    private async resolve(manager: any | Shoukaku) {
        const query = [this.info.author, this.info.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await manager.search(query, "ytsearch");
        if (!result || !result.tracks.length) return;

        if (this.info.author) {
            const author = [this.info.author, `Best of ${this.info.author} `];
            const officialAudio = result.tracks.find(
                (track) =>
                    author.some((name) =>
                        new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)
                    ) ||
                    new RegExp(`^${escapeRegExp(this.info.title)}$`, "i").test(
                        track.info.title
                    )
            );
            if (officialAudio) {
                this.info.identifier = officialAudio.info.identifier;
                this.track = officialAudio.track;
                this.info.length = officialAudio.info.length;
                return this;
            }
        }
        if (this.info.length) {
            const sameDuration = result.tracks.find(
                (track) =>
                    track.info.length >= (this.info.length ? this.info.length : 0) - 2000 &&
                    track.info.length <= (this.info.length ? this.info.length : 0) + 2000
            );
            if (sameDuration) {
                this.info.identifier = sameDuration.info.identifier;
                this.track = sameDuration.track;
                this.info.length = sameDuration.length;
                return this;
            }
        }
        this.info.identifier = result.tracks[0].info.identifier;
        this.track = result.tracks[0].track;
        this.info.length = result.tracks[0].info.length;
        return this;
    }
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */