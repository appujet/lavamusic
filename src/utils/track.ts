import type { Track } from 'lavalink-client';

export interface MappedTrack {
	uri: string;
	title: string;
	author: string;
	duration: number;
	thumbnail: string;
	identifier: string;
	requester?: {
		username: string;
	}
}

export const mapTrack = (track?: Track & { requester?: any }): MappedTrack | {} => {
	if (!(track?.info)) return {};
	return {
		uri: track.info.uri,
		title: track.info.title,
		author: track.info.author,
		duration: track.info.duration,
		thumbnail: `https://img.youtube.com/vi/${track.info.identifier}/default.jpg`,
		identifier: track.info.identifier,
		...(track.requester?.username !== 'unknown' && {
			requester: {
				username: track.requester.username
			}
		})
	};
};

export const mapTracks = (tracks: (Track & { requester?: any })[] = []): MappedTrack[] | {} => {
	if (!tracks?.length) return [];
	return tracks.map(mapTrack);
};