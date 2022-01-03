"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const Utils_1 = require("./Utils");
/**
 * The player's queue, the `current` property is the currently playing track, think of the rest as the up-coming tracks.
 * @noInheritDoc
 */
class Queue extends Array {
    constructor() {
        super(...arguments);
        /** The current track */
        this.current = null;
        /** The previous track */
        this.previous = null;
    }
    /** The total duration of the queue. */
    get duration() {
        var _a, _b;
        const current = (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 0;
        return this
            .reduce((acc, cur) => acc + (cur.duration || 0), current);
    }
    /** The total size of tracks in the queue including the current track. */
    get totalSize() {
        return this.length + (this.current ? 1 : 0);
    }
    /** The size of tracks in the queue. */
    get size() {
        return this.length;
    }
    /**
     * Adds a track to the queue.
     * @param track
     * @param [offset=null]
     */
    add(track, offset) {
        if (!Utils_1.TrackUtils.validate(track)) {
            throw new RangeError('Track must be a "Track" or "Track[]".');
        }
        if (!this.current) {
            if (!Array.isArray(track)) {
                this.current = track;
                return;
            }
            else {
                this.current = (track = [...track]).shift();
            }
        }
        if (typeof offset !== "undefined" && typeof offset === "number") {
            if (isNaN(offset)) {
                throw new RangeError("Offset must be a number.");
            }
            if (offset < 0 || offset > this.length) {
                throw new RangeError(`Offset must be or between 0 and ${this.length}.`);
            }
        }
        if (typeof offset === "undefined" && typeof offset !== "number") {
            if (track instanceof Array)
                this.push(...track);
            else
                this.push(track);
        }
        else {
            if (track instanceof Array)
                this.splice(offset, 0, ...track);
            else
                this.splice(offset, 0, track);
        }
    }
    remove(startOrPosition = 0, end) {
        if (typeof end !== "undefined") {
            if (isNaN(Number(startOrPosition))) {
                throw new RangeError(`Missing "start" parameter.`);
            }
            else if (isNaN(Number(end))) {
                throw new RangeError(`Missing "end" parameter.`);
            }
            else if (startOrPosition >= end) {
                throw new RangeError("Start can not be bigger than end.");
            }
            else if (startOrPosition >= this.length) {
                throw new RangeError(`Start can not be bigger than ${this.length}.`);
            }
            return this.splice(startOrPosition, end - startOrPosition);
        }
        return this.splice(startOrPosition, 1);
    }
    /** Clears the queue. */
    clear() {
        this.splice(0);
    }
    /** Shuffles the queue. */
    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}
exports.Queue = Queue;
