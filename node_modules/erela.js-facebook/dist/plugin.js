'use strict';
const __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) { reject(e); }
		}
		function rejected(value) {
			try {
				step(generator['throw'](value));
			} catch (e) { reject(e); }
		}
		function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};

Object.defineProperty(exports, '__esModule', { value: true });
exports.Facebook = void 0;
const erela_js_1 = require('erela.js');
const REGEX = /(?:https?:\/\/)?(?:www.|web.|m.)?(facebook|fb).(com|watch)\/(?:video.php\?v=\d+|(\S+)|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?/g;
const { get } = require('axios');
const cheerio = require('cheerio');


const buildSearch = (loadType, tracks, error) => ({
	loadType: loadType,
	tracks: tracks !== null && tracks !== void 0 ? tracks : [],
	playlist: null,
	exception: error ? {
		message: error,
		severity: 'COMMON',
	} : null,
});

class Facebook extends erela_js_1.Plugin {
	constructor() {
		super();
	}

	// load up the plugin
	load(manager) {
		this.manager = manager;
		this._search = manager.search.bind(manager);
		manager.search = this.search.bind(this);
	}

	// search up the facebook video
	search(query, requester) {
		let _a, _b, _c;
		return __awaiter(this, void 0, void 0, function* () {
			const finalQuery = query.query || query;
			const [, type, id] = (_a = finalQuery.match(REGEX)) !== null && _a !== void 0 ? _a : [];
			if (finalQuery.match(REGEX)) {
				try {
					const html = yield get(query.replace('/m.', '/'));
					const $ = cheerio.load(html.data);
					const r = $('script[type=\'application/ld+json\']');
					const json = JSON.parse(r[0].children[0].data);
					const obj = {
						title: json.name || 'null',
						thumbnail: json.thumbnailUrl || 'null',
						streamURL: json.url || 'null',
						url: query || 'null',
						author: json.author.name || 'null',
					};
					if (obj.streamURL) {
						const data = yield this.manager.search(obj.streamURL, requester);
						data.tracks[0].title = obj.title;
						data.tracks[0].thumbnail = obj.thumbnail;
						data.tracks[0].uri = obj.url;
						const loadType = 'TRACK_LOADED';
						return buildSearch(loadType, data.tracks, null);
					} else {
						const msg = 'Incorrect type for Facebook URL.';
						return buildSearch('LOAD_FAILED', null, msg);
					}
				} catch (e) {
					console.log(e.message);
					return buildSearch((_b = e.loadType) !== null && _b !== void 0 ? _b : 'LOAD_FAILED', null, (_c = e.message) !== null && _c !== void 0 ? _c : null, null);
				}
			}
			return this._search(query, requester);
		});
	}
}
exports.Facebook = Facebook;
