import { Guild, TextChannel, User, Message } from 'discord.js';
import { Player, Track } from 'shoukaku';
import { EventEmitter } from 'events';
import { Lavamusic } from './index.js';

export class Song implements Track {
    track: string;
    info: {
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
        requester: User;
    }
    constructor(track: Song, user: User) {
        this.track = track.track;
        this.info = track.info;
        this.info.requester = user;
    }
}

export default class Dispatcher extends EventEmitter {
    public client: Lavamusic;
    public guild: Guild;
    public channel: TextChannel;
    public player: Player;
    public queue: Song[];
    public stopped: boolean;
    public previous: Song | null;
    public current: Song | null;
    public loop: 'off' | 'repeat' | 'queue';
    public matchedTracks: Song[];
    public requester: User;
    public repeat: number;
    public shuffle: boolean;
    public paused: boolean;
    public nowPlayingMessage: Message | null;
    constructor(client: Lavamusic, guild: Guild, channel: TextChannel, player: Player, user: User) {
        super();
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.player = player;
        this.queue = [];
        this.stopped = false;
        this.previous = null;
        this.current = null;
        this.loop = 'off';
        this.matchedTracks = [];
        this.requester = user;
        this.repeat = 0;
        this.shuffle = false;
        this.paused = false;
        this.nowPlayingMessage = null;

        this.player
            .on('start', (data) =>
                this.manager.emit('trackStart', this.player, this.current, this.channel, this.matchedTracks, this, data),
            )
            .on('end', (data) => {
                if (!this.queue.length) this.manager.emit('queueEnd', this.player, this.current, this.channel, this, data);
                this.manager.emit('trackEnd', this.player, this.current, this.channel, this, data);
            })
            .on('stuck', (data) =>
                this.manager.emit('trackStuck', this.player, this.current, data),
            )
            .on('closed', (...arr) => {
                this.manager.emit('socketClosed', this.player, ...arr);
            });
    }

    get manager() {
        return this.client.manager;
    }

    get exists() {
        return this.manager.players.has(this.guild.id);
    }
    get volume() {
        return this.player.filters.volume;
    }
    public async play() {
        if (!this.exists || (!this.queue.length && !this.current)) {
            this.destroy();
            return;
        }
        this.current = this.queue.length !== 0 ? this.queue.shift() : this.queue[0];
        if (this.matchedTracks.length !== 0) this.matchedTracks = [];
        const search = await this.manager.search(this.current.info.title, { requester: this.requester });
        this.matchedTracks.push(...search.tracks.slice(0, 11));
        this.player.playTrack({ track: this.current.track });
    }
    public pause() {
        if (!this.player) return;
        if (!this.paused) {
            this.player.setPaused(true);
            this.paused = true;
        } else {
            this.player.setPaused(false);
            this.paused = false;
        }
    }
    public remove(index: number) {
        if (!this.player) return;
        if (index > this.queue.length) return;
        this.queue.splice(index, 1);
    }
    public previousTrack() {
        if (!this.player) return;
        if (!this.previous) return;
        this.queue.unshift(this.previous);
        this.player.stopTrack();
    }
    public destroy() {
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.manager.players.delete(this.guild.id);
        if (this.stopped) return;
        this.manager.emit('playerDestroy', this.player);
    }
    public setShuffle(shuffle: boolean) {
        if (!this.player) return;
        this.shuffle = shuffle;
        if (shuffle) {
            const current = this.queue.shift();
            this.queue = this.queue.sort(() => Math.random() - 0.5);
            this.queue.unshift(current);
        } else {
            const current = this.queue.shift();
            this.queue = this.queue.sort((a: any, b: any) => a - b);
            this.queue.unshift(current);
        }
    }
    public async skip(skipto = 1) {
        if (!this.player) return;
        if (skipto > 1) {
            this.queue.unshift(this.queue[skipto - 1]);
            this.queue.splice(skipto, 1);
        }
        this.repeat = this.repeat == 1 ? 0 : this.repeat
        this.player.stopTrack();
    }
    public seek(time: number) {
        if (!this.player) return;
        this.player.seekTo(time);
    }
    public stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.repeat = 0;
        this.player.stopTrack();
    }
    public setLoop(loop: any) {
        this.loop = loop;
    }
    public async deleteNowPlayingMessage() {
        if (this.nowPlayingMessage) {
            await this.nowPlayingMessage.delete();
            this.nowPlayingMessage = null;
        }
    }
    public buildTrack(track: Song, user: User) {
        return new Song(track, user);
    }
    public async isPlaying() {
        if (this.queue.length && !this.current && !this.player.paused) {
            this.play();
        }
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