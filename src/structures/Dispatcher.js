import { Guild, TextChannel, User, Message } from 'discord.js';
import { Player } from 'shoukaku';
import { EventEmitter } from 'events';
import { BotClient } from './Client.js';
export default class Dispatcher extends EventEmitter {
    /**
     *
     * @param {BotClient} client
     * @param {Guild} guild
     * @param {TextChannel} channel
     * @param {Player} player
     * @param {User} user
     */
    constructor(client, guild, channel, player, user) {
        super();
        /**
         * @type {BotClient}
         */
        this.client = client;
        /**
         * @type {Guild}
         */
        this.guild = guild;
        /**
         * @type {TextChannel}
         */
        this.channel = channel;
        /**
         * @type {Player}
         */
        this.player = player;
        /**
         * @type {Array<import('shoukaku').Track>}
         */
        this.queue = [];
        /**
         * @type {boolean}
         */
        this.stopped = false;
        /**
         * @type {Array<import('shoukaku').Track>}
         */
        this.previous = null;
        /**
         * @type {import('shoukaku').Track}
         */
        this.current = null;
        /**
         * @type {'off'|'repeat'|'queue'}
         */
        this.loop = 'off';
        /**
         * @type {import('shoukaku').Track[]}
         */
        this.matchedTracks = [];
        /**
         * @type {User}
         */
        this.requester = user;
        /**
         * @type {number}
         */
        this.repeat = 0;
        /**
         * @type {boolean}
         */
        this.shuffle = false;
        /**
         * @type {boolean}
         */
        this.paused = false;
        /**
         * @type {Message}
         */
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
            .on('error', (...arr) => {
                this.manager.emit('trackError', this.player, this.current, ...arr);
                this._errorHandler(...arr);
            })
            .on('closed', (...arr) => {
                this.manager.emit('socketClosed', this.player, ...arr);
                this._errorHandler(...arr);
            });
    }

    get manager() {
        return this.client.manager;
    }
    /**
     *
     * @param {Error} data
     */
    _errorHandler(data) {
        if (data instanceof Error || data instanceof Object) {
            this.client.logger.error(data);
        }
        this.queue.length = 0;
        this.destroy('error');
    }

    get exists() {
        return this.manager.players.has(this.guild.id);
    }
    get volume() {
        return this.player.filters.volume;
    }
    setRequester(user) {
        this.requester = user;
    }
    async play() {
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
    pause() {
        if (!this.player) return;
        if(!this.paused) {
            this.player.setPaused(true);
            this.paused = true;
        } else {
            this.player.setPaused(false);
            this.paused = false;
        }
    }
    remove(index) {
        if (!this.player) return;
        if (index > this.queue.length) return;
        this.queue.splice(index, 1);
    }
    previousTrack() {
        if (!this.player) return;
        if (!this.previous) return;
        this.queue.unshift(this.previous);
        this.player.stopTrack();
    }
    destroy() {
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.manager.players.delete(this.guild.id);
        if (this.stopped) return;
        this.manager.emit('playerDestroy', this.player);
    }
    setShuffle(shuffle) {
        if (!this.player) return;
        this.shuffle = shuffle;
        if (shuffle) {
            const current = this.queue.shift();
            this.queue = this.queue.sort(() => Math.random() - 0.5);
            this.queue.unshift(current);
        } else {
            const current = this.queue.shift();
            this.queue = this.queue.sort((a, b) => a - b);
            this.queue.unshift(current);
        }
    }
    async skip(skipto = 1) {
        if (!this.player) return;
        if (skipto > 1) {
            this.queue.unshift(this.queue[skipto - 1]);
            this.queue.splice(skipto, 1);
        }
        this.repeat = this.repeat == 1 ? 0 : this.repeat
        await this.player.stopTrack();
    }
    seek(time) {
        if (!this.player) return;
        this.player.seekTo(time);
    }
    stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.repeat = 0;
        this.player.stopTrack();
    }
    setLoop(loop) {
        this.loop = loop;
    }
    async deleteNowPlayingMessage() {
        if (this.nowPlayingMessage) {
            await this.nowPlayingMessage.delete();
            this.nowPlayingMessage = null;
        }
    }
    /**
     *
     * @param {import('shoukaku').Track} providedTrack
     * @returns {string}
     */
    displayThumbnail(providedTrack) {
        const track = providedTrack || this.current;
        if (track.info.uri.includes('youtube')) {
            return `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`;
        } else if (track.info.uri.includes('soundcloud')) {
            return track.info.thumbnail;
        } else if (track.info.uri.includes('spotify')) {
            return track.info.thumbnail;
        }
        return null;
    }

    async isPlaying() {
        if (this.queue.length && !this.current && !this.player.paused) {
            this.play();
        }
    }
}
