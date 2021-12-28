"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Utils_1 = require("./Utils");
function check(options) {
    if (!options)
        throw new TypeError("PlayerOptions must not be empty.");
    if (!/^\d+$/.test(options.guild))
        throw new TypeError('Player option "guild" must be present and be a non-empty string.');
    if (options.textChannel && !/^\d+$/.test(options.textChannel))
        throw new TypeError('Player option "textChannel" must be a non-empty string.');
    if (options.voiceChannel && !/^\d+$/.test(options.voiceChannel))
        throw new TypeError('Player option "voiceChannel" must be a non-empty string.');
    if (options.node && typeof options.node !== "string")
        throw new TypeError('Player option "node" must be a non-empty string.');
    if (typeof options.volume !== "undefined" &&
        typeof options.volume !== "number")
        throw new TypeError('Player option "volume" must be a number.');
    if (typeof options.selfMute !== "undefined" &&
        typeof options.selfMute !== "boolean")
        throw new TypeError('Player option "selfMute" must be a boolean.');
    if (typeof options.selfDeafen !== "undefined" &&
        typeof options.selfDeafen !== "boolean")
        throw new TypeError('Player option "selfDeafen" must be a boolean.');
}
class Player {
    /**
     * Creates a new player, returns one if it already exists.
     * @param options
     */
    constructor(options) {
        var _a;
        this.options = options;
        /** The Queue for the Player. */
        this.queue = new (Utils_1.Structure.get("Queue"))();
        /** Whether the queue repeats the track. */
        this.trackRepeat = false;
        /** Whether the queue repeats the queue. */
        this.queueRepeat = false;
        /** The time the player is in the track. */
        this.position = 0;
        /** Whether the player is playing. */
        this.playing = false;
        /** Whether the player is paused. */
        this.paused = false;
        /** The voice channel for the player. */
        this.voiceChannel = null;
        /** The text channel for the player. */
        this.textChannel = null;
        /** The current state of the player. */
        this.state = "DISCONNECTED";
        /** The equalizer bands array. */
        this.bands = new Array(15).fill(0.0);
        /** The voice state object from Discord. */
        this.voiceState = Object.assign({});
        this.data = {};
        if (!this.manager)
            this.manager = Utils_1.Structure.get("Player")._manager;
        if (!this.manager)
            throw new RangeError("Manager has not been initiated.");
        if (this.manager.players.has(options.guild)) {
            return this.manager.players.get(options.guild);
        }
        check(options);
        this.guild = options.guild;
        if (options.voiceChannel)
            this.voiceChannel = options.voiceChannel;
        if (options.textChannel)
            this.textChannel = options.textChannel;
        const node = this.manager.nodes.get(options.node);
        this.node = node || this.manager.leastLoadNodes.first();
        if (!this.node)
            throw new RangeError("No available nodes.");
        this.manager.players.set(options.guild, this);
        this.manager.emit("playerCreate", this);
        this.setVolume((_a = options.volume) !== null && _a !== void 0 ? _a : 100);
    }
    /**
     * Set custom data.
     * @param key
     * @param value
     */
    set(key, value) {
        this.data[key] = value;
    }
    /**
     * Get custom data.
     * @param key
     */
    get(key) {
        return this.data[key];
    }
    /** @hidden */
    static init(manager) {
        this._manager = manager;
    }
    /**
     * Same as Manager#search() but a shortcut on the player itself.
     * @param query
     * @param requester
     */
    search(query, requester) {
        return this.manager.search(query, requester);
    }
    /**
     * Sets the players equalizer band on-top of the existing ones.
     * @param bands
     */
    setEQ(...bands) {
        // Hacky support for providing an array
        if (Array.isArray(bands[0]))
            bands = bands[0];
        if (!bands.length || !bands.every((band) => JSON.stringify(Object.keys(band).sort()) === '["band","gain"]'))
            throw new TypeError("Bands must be a non-empty object array containing 'band' and 'gain' properties.");
        for (const { band, gain } of bands)
            this.bands[band] = gain;
        this.node.send({
            op: "equalizer",
            guildId: this.guild,
            bands: this.bands.map((gain, band) => ({ band, gain })),
        });
        return this;
    }
    /** Clears the equalizer bands. */
    clearEQ() {
        this.bands = new Array(15).fill(0.0);
        this.node.send({
            op: "equalizer",
            guildId: this.guild,
            bands: this.bands.map((gain, band) => ({ band, gain })),
        });
        return this;
    }
    /** Connect to the voice channel. */
    connect() {
        if (!this.voiceChannel)
            throw new RangeError("No voice channel has been set.");
        this.state = "CONNECTING";
        this.manager.options.send(this.guild, {
            op: 4,
            d: {
                guild_id: this.guild,
                channel_id: this.voiceChannel,
                self_mute: this.options.selfMute || false,
                self_deaf: this.options.selfDeafen || false,
            },
        });
        this.state = "CONNECTED";
        return this;
    }
    /** Disconnect from the voice channel. */
    disconnect() {
        if (this.voiceChannel === null)
            return this;
        this.state = "DISCONNECTING";
        this.pause(true);
        this.manager.options.send(this.guild, {
            op: 4,
            d: {
                guild_id: this.guild,
                channel_id: null,
                self_mute: false,
                self_deaf: false,
            },
        });
        this.voiceChannel = null;
        this.state = "DISCONNECTED";
        return this;
    }
    /** Destroys the player. */
    destroy() {
        this.state = "DESTROYING";
        this.disconnect();
        this.node.send({
            op: "destroy",
            guildId: this.guild,
        });
        this.manager.emit("playerDestroy", this);
        this.manager.players.delete(this.guild);
    }
    /**
     * Sets the player voice channel.
     * @param channel
     */
    setVoiceChannel(channel) {
        if (typeof channel !== "string")
            throw new TypeError("Channel must be a non-empty string.");
        this.voiceChannel = channel;
        this.connect();
        return this;
    }
    /**
     * Sets the player text channel.
     * @param channel
     */
    setTextChannel(channel) {
        if (typeof channel !== "string")
            throw new TypeError("Channel must be a non-empty string.");
        this.textChannel = channel;
        return this;
    }
    play(optionsOrTrack, playOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof optionsOrTrack !== "undefined" &&
                Utils_1.TrackUtils.validate(optionsOrTrack)) {
                if (this.queue.current)
                    this.queue.previous = this.queue.current;
                this.queue.current = optionsOrTrack;
            }
            if (!this.queue.current)
                throw new RangeError("No current track.");
            const finalOptions = playOptions
                ? playOptions
                : ["startTime", "endTime", "noReplace"].every((v) => Object.keys(optionsOrTrack || {}).includes(v))
                    ? optionsOrTrack
                    : {};
            if (Utils_1.TrackUtils.isUnresolvedTrack(this.queue.current)) {
                try {
                    this.queue.current = yield Utils_1.TrackUtils.getClosestTrack(this.queue.current);
                }
                catch (error) {
                    this.manager.emit("trackError", this, this.queue.current, error);
                    if (this.queue[0])
                        return this.play(this.queue[0]);
                    return;
                }
            }
            const options = Object.assign({ op: "play", guildId: this.guild, track: this.queue.current.track }, finalOptions);
            if (typeof options.track !== "string") {
                options.track = options.track.track;
            }
            yield this.node.send(options);
        });
    }
    /**
     * Sets the player volume.
     * @param volume
     */
    setVolume(volume) {
        volume = Number(volume);
        if (isNaN(volume))
            throw new TypeError("Volume must be a number.");
        this.volume = Math.max(Math.min(volume, 1000), 0);
        this.node.send({
            op: "volume",
            guildId: this.guild,
            volume: this.volume,
        });
        return this;
    }
    /**
     * Sets the track repeat.
     * @param repeat
     */
    setTrackRepeat(repeat) {
        if (typeof repeat !== "boolean")
            throw new TypeError('Repeat can only be "true" or "false".');
        if (repeat) {
            this.trackRepeat = true;
            this.queueRepeat = false;
        }
        else {
            this.trackRepeat = false;
            this.queueRepeat = false;
        }
        return this;
    }
    /**
     * Sets the queue repeat.
     * @param repeat
     */
    setQueueRepeat(repeat) {
        if (typeof repeat !== "boolean")
            throw new TypeError('Repeat can only be "true" or "false".');
        if (repeat) {
            this.trackRepeat = false;
            this.queueRepeat = true;
        }
        else {
            this.trackRepeat = false;
            this.queueRepeat = false;
        }
        return this;
    }
    /** Stops the current track, optionally give an amount to skip to, e.g 5 would play the 5th song. */
    stop(amount) {
        if (typeof amount === "number" && amount > 1) {
            if (amount > this.queue.length)
                throw new RangeError("Cannot skip more than the queue length.");
            this.queue.splice(0, amount - 1);
        }
        this.node.send({
            op: "stop",
            guildId: this.guild,
        });
        return this;
    }
    /**
     * Pauses the current track.
     * @param pause
     */
    pause(pause) {
        if (typeof pause !== "boolean")
            throw new RangeError('Pause can only be "true" or "false".');
        // If already paused or the queue is empty do nothing https://github.com/MenuDocs/erela.js/issues/58
        if (this.paused === pause || !this.queue.totalSize)
            return this;
        this.playing = !pause;
        this.paused = pause;
        this.node.send({
            op: "pause",
            guildId: this.guild,
            pause,
        });
        return this;
    }
    /**
     * Seeks to the position in the current track.
     * @param position
     */
    seek(position) {
        if (!this.queue.current)
            return undefined;
        position = Number(position);
        if (isNaN(position)) {
            throw new RangeError("Position must be a number.");
        }
        if (position < 0 || position > this.queue.current.duration)
            position = Math.max(Math.min(position, this.queue.current.duration), 0);
        this.position = position;
        this.node.send({
            op: "seek",
            guildId: this.guild,
            position,
        });
        return this;
    }
}
exports.Player = Player;
