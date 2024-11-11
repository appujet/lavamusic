import type { Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { EmbedBuilder } from 'discord.js';
import { z } from 'zod';

class PlaylistController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public playlists = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const playlists = await this.client.dbNew.getGuildPlaylists(req.guild!.id);
			if (!playlists?.length) {
				response.error(res, 404, `No playlists found for guild id: ${req.guild!.id}`);
				return;
			}

			response.success(res, { playlists });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playlistCreate = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			name: z.string().min(1, 'Playlist name must not be empty')
		});

		try {
			const { name } = schema.parse(req.body ?? {});
			await this.client.dbNew.createGuildPlaylist(req.guild!.id, name);

			response.success(res, {
				message: `Playlist ${name} has been created`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public playlist = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const playlist = await this.client.dbNew.getGuildPlaylist(req.guild!.id, req.params.playlistId);
			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			response.success(res, { playlist });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playlistDelete = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const playlist = await this.client.dbNew.getGuildPlaylist(req.guild!.id, req.params.playlistId);
			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			await this.client.dbNew.deleteGuildPlaylist(req.guild!.id, req.params.playlistId);
			response.success(res, {
				message: `Playlist ${playlist.PlaylistName} has been deleted`
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playlistAddTrack = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			identifier: z.string().min(1, 'Track identifier must not be empty')
		});

		try {
			const { identifier } = schema.parse(req.body ?? {});
			const playlist = await this.client.dbNew.getGuildPlaylist(req.guild!.id, req.params.playlistId);

			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			const uri = `https://youtube.com/watch?v=${identifier}`;
			const search = await this.client.manager.search(uri, this.client.user);

			if (!search.tracks?.length) {
				response.error(res, 404, 'No track found');
				return;
			}

			const track = search.tracks[0];
			const trackData = {
				id: (Date.now() + Math.random()).toString(),
				title: track.info.title,
				identifier: track.info.identifier,
				uri: track.info.uri,
				thumbnail: track.info.artworkUrl,
				author: track.info.author,
				duration: track.info.duration
			};

			await this.client.dbNew.addTrackToPlaylist(req.guild!.id, req.params.playlistId, trackData);

			response.success(res, {
				message: `Track ${track.info.title} has been added to playlist`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public playlistRemoveTrack = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const playlist = await this.client.dbNew.getGuildPlaylist(req.guild!.id, req.params.playlistId);
			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			await this.client.dbNew.removeTrackFromPlaylist(
				req.guild!.id,
				req.params.playlistId,
				req.params.trackId
			);

			response.success(res, {
				message: 'Track has been removed from playlist'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playlistLoad = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;
			const playlist = await this.client.dbNew.getGuildPlaylist(guild!.id, req.params.playlistId);

			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			const loadMessage = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Adding playlist ${playlist.PlaylistName} to queue...`)
				.setColor(this.client.color.main);

			const messageSend = await channel!.send({ embeds: [loadMessage] });

			// Add tracks to queue
			const tracks = playlist.Playlist as any[];
			for (const trackData of tracks) {
				const result = await player!.search(trackData.uri, user || this.client.user);
				if (result.tracks?.length) {
					await player!.queue.add(result.tracks[0]);
				}
			}

			if (!player!.playing) await player!.play();

			this.client.socket.io.to(player!.guildId).emit('player:queueUpdate:success', {
				queue: player!.queue
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Loaded playlist ${playlist.PlaylistName}`)
				.setColor(this.client.color.main);

			await messageSend.edit({ embeds: [message] });

			response.success(res, {
				message: `Playlist ${playlist.PlaylistName} has been loaded`
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playlistImport = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			playlistUrl: z.string().min(1, 'Playlist URL must not be empty')
		});

		try {
			const { playlistUrl } = schema.parse(req.body ?? {});
			const playlist = await this.client.dbNew.getGuildPlaylist(req.guild!.id, req.params.playlistId);

			if (!playlist) {
				response.error(res, 404, 'Playlist not found');
				return;
			}

			const search = await this.client.manager.search(playlistUrl, this.client.user);
			if (!search.tracks?.length) {
				response.error(res, 404, 'No tracks found in the provided playlist');
				return;
			}

			const tracks = search.tracks.map((track, index) => ({
				id: (index + Date.now() + Math.random()).toString(),
				title: track.info.title,
				identifier: track.info.identifier,
				uri: track.info.uri,
				thumbnail: track.info.artworkUrl,
				author: track.info.author,
				duration: track.info.duration
			}));

			await this.client.dbNew.addTracksToPlaylist(req.guild!.id, req.params.playlistId, tracks);

			response.success(res, {
				message: `Imported ${tracks.length} tracks to playlist`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};
}

export default PlaylistController;
