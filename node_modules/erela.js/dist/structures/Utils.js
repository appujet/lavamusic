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
exports.Plugin = exports.Structure = exports.TrackUtils = void 0;
/** @hidden */
const TRACK_SYMBOL = Symbol("track"), 
/** @hidden */
UNRESOLVED_TRACK_SYMBOL = Symbol("unresolved"), SIZES = [
    "0",
    "1",
    "2",
    "3",
    "default",
    "mqdefault",
    "hqdefault",
    "maxresdefault",
];
/** @hidden */
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class TrackUtils {
    /** @hidden */
    static init(manager) {
        this.manager = manager;
    }
    static setTrackPartial(partial) {
        if (!Array.isArray(partial) || !partial.every(str => typeof str === "string"))
            throw new Error("Provided partial is not an array or not a string array.");
        if (!partial.includes("track"))
            partial.unshift("track");
        this.trackPartial = partial;
    }
    /**
     * Checks if the provided argument is a valid Track or UnresolvedTrack, if provided an array then every element will be checked.
     * @param trackOrTracks
     */
    static validate(trackOrTracks) {
        if (typeof trackOrTracks === "undefined")
            throw new RangeError("Provided argument must be present.");
        if (Array.isArray(trackOrTracks) && trackOrTracks.length) {
            for (const track of trackOrTracks) {
                if (!(track[TRACK_SYMBOL] || track[UNRESOLVED_TRACK_SYMBOL]))
                    return false;
            }
            return true;
        }
        return (trackOrTracks[TRACK_SYMBOL] ||
            trackOrTracks[UNRESOLVED_TRACK_SYMBOL]) === true;
    }
    /**
     * Checks if the provided argument is a valid UnresolvedTrack.
     * @param track
     */
    static isUnresolvedTrack(track) {
        if (typeof track === "undefined")
            throw new RangeError("Provided argument must be present.");
        return track[UNRESOLVED_TRACK_SYMBOL] === true;
    }
    /**
     * Checks if the provided argument is a valid Track.
     * @param track
     */
    static isTrack(track) {
        if (typeof track === "undefined")
            throw new RangeError("Provided argument must be present.");
        return track[TRACK_SYMBOL] === true;
    }
    /**
     * Builds a Track from the raw data from Lavalink and a optional requester.
     * @param data
     * @param requester
     */
    static build(data, requester) {
        if (typeof data === "undefined")
            throw new RangeError('Argument "data" must be present.');
        try {
            const track = {
                track: data.track,
                title: data.info.title,
                identifier: data.info.identifier,
                author: data.info.author,
                duration: data.info.length,
                isSeekable: data.info.isSeekable,
                isStream: data.info.isStream,
                uri: data.info.uri,
                thumbnail: data.info.uri.includes("youtube")
                    ? `https://img.youtube.com/vi/${data.info.identifier}/default.jpg`
                    : null,
                displayThumbnail(size = "default") {
                    var _a;
                    const finalSize = (_a = SIZES.find((s) => s === size)) !== null && _a !== void 0 ? _a : "default";
                    return this.uri.includes("youtube")
                        ? `https://img.youtube.com/vi/${data.info.identifier}/${finalSize}.jpg`
                        : null;
                },
                requester,
            };
            track.displayThumbnail = track.displayThumbnail.bind(track);
            if (this.trackPartial) {
                for (const key of Object.keys(track)) {
                    if (this.trackPartial.includes(key))
                        continue;
                    delete track[key];
                }
            }
            Object.defineProperty(track, TRACK_SYMBOL, {
                configurable: true,
                value: true
            });
            return track;
        }
        catch (error) {
            throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
        }
    }
    /**
     * Builds a UnresolvedTrack to be resolved before being played  .
     * @param query
     * @param requester
     */
    static buildUnresolved(query, requester) {
        if (typeof query === "undefined")
            throw new RangeError('Argument "query" must be present.');
        let unresolvedTrack = {
            requester,
            resolve() {
                return __awaiter(this, void 0, void 0, function* () {
                    const resolved = yield TrackUtils.getClosestTrack(this);
                    Object.getOwnPropertyNames(this).forEach(prop => delete this[prop]);
                    Object.assign(this, resolved);
                });
            }
        };
        if (typeof query === "string")
            unresolvedTrack.title = query;
        else
            unresolvedTrack = Object.assign(Object.assign({}, unresolvedTrack), query);
        Object.defineProperty(unresolvedTrack, UNRESOLVED_TRACK_SYMBOL, {
            configurable: true,
            value: true
        });
        return unresolvedTrack;
    }
    static getClosestTrack(unresolvedTrack) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!TrackUtils.manager)
                throw new RangeError("Manager has not been initiated.");
            if (!TrackUtils.isUnresolvedTrack(unresolvedTrack))
                throw new RangeError("Provided track is not a UnresolvedTrack.");
            const query = [unresolvedTrack.author, unresolvedTrack.title].filter(str => !!str).join(" - ");
            const res = yield TrackUtils.manager.search(query, unresolvedTrack.requester);
            if (res.loadType !== "SEARCH_RESULT")
                throw (_a = res.exception) !== null && _a !== void 0 ? _a : {
                    message: "No tracks found.",
                    severity: "COMMON",
                };
            if (unresolvedTrack.author) {
                const channelNames = [unresolvedTrack.author, `${unresolvedTrack.author} - Topic`];
                const originalAudio = res.tracks.find(track => {
                    return (channelNames.some(name => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.author)) ||
                        new RegExp(`^${escapeRegExp(unresolvedTrack.title)}$`, "i").test(track.title));
                });
                if (originalAudio)
                    return originalAudio;
            }
            if (unresolvedTrack.duration) {
                const sameDuration = res.tracks.find(track => (track.duration >= (unresolvedTrack.duration - 1500)) &&
                    (track.duration <= (unresolvedTrack.duration + 1500)));
                if (sameDuration)
                    return sameDuration;
            }
            return res.tracks[0];
        });
    }
}
exports.TrackUtils = TrackUtils;
TrackUtils.trackPartial = null;
/** Gets or extends structures to extend the built in, or already extended, classes to add more functionality. */
class Structure {
    /**
     * Extends a class.
     * @param name
     * @param extender
     */
    static extend(name, extender) {
        if (!structures[name])
            throw new TypeError(`"${name} is not a valid structure`);
        const extended = extender(structures[name]);
        structures[name] = extended;
        return extended;
    }
    /**
     * Get a structure from available structures by name.
     * @param name
     */
    static get(name) {
        const structure = structures[name];
        if (!structure)
            throw new TypeError('"structure" must be provided.');
        return structure;
    }
}
exports.Structure = Structure;
class Plugin {
    load(manager) { }
    unload(manager) { }
}
exports.Plugin = Plugin;
const structures = {
    Player: require("./Player").Player,
    Queue: require("./Queue").Queue,
    Node: require("./Node").Node,
};
