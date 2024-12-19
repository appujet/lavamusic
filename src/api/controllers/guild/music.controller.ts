import type { Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { EmbedBuilder } from 'discord.js';
import { z } from 'zod';
import type { LavalinkNodeOptions, SearchResult, Track, UnresolvedSearchResult } from 'lavalink-client';
import type { LavalinkNode } from 'lavalink-client';
import { mapTrack, mapTracks } from '@/utils/track';
import { testConnection, waitForPlayerConnection } from '@/utils/lavalink';

class MusicController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public search = async (req: GuildRequest, res: Response): Promise<void> => {
		const searchSchema = z.object({
			query: z.string().min(1, 'Query must not be empty'),
			source: z.enum(['youtube', 'ytsearch', 'youtube music', 'ytmsearch', 'soundcloud']).optional(),
		});

		try {
			const { query, source } = searchSchema.parse(req.query);
			const player = this.client.manager.getPlayer(req.guild!.id);
			const result = player ? await player.search({ query, source }, null, false) : await this.client.manager.search(query, null, source);
			const mappedResult = mapTracks(result.tracks as Track[]);
			response.success(res, { search: { tracks: mappedResult } });

		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `An unexpected error occurred: ${error}`);
			}
		}
	};

	public playerCreate = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			voiceChannel: z.string().min(1, 'Voice channel ID must not be empty'),
			textChannel: z.string().min(1, 'Text channel ID must not be empty'),
			nodeId: z.string().optional()
		});

		try {
			const { voiceChannel, textChannel, nodeId } = schema.parse(req.body || {});
			const { guild, user } = req;

			const player = this.client.manager.getPlayer(guild!.id);
			if (player) {
				response.error(res, 400, `Player already exists for guild id: ${guild!.id}`);
				return;
			}

			const voiceChannelObj = guild!.channels.cache.get(voiceChannel);
			if (!voiceChannelObj?.isVoiceBased()) {
				response.error(res, 404, `Invalid voice channel: ${voiceChannel}`);
				return;
			}

			const textChannelObj = guild!.channels.cache.get(textChannel);
			if (!textChannelObj?.isTextBased()) {
				response.error(res, 404, `Invalid text channel: ${textChannel}`);
				return;
			}

			if (voiceChannelObj?.members.filter((member) => !member.user.bot).size === 0) {
				const emptyChannelEmbed = this.client
					.embed()
					.setColor(this.client.color.main)
					.setDescription('Cannot join an empty voice channel, please join a voice channel first.');
				await textChannelObj.send({ embeds: [emptyChannelEmbed] });
				response.error(res, 400, 'Cannot join an empty voice channel, please join a voice channel first.');
				return;
			}

			let customNode: LavalinkNode | undefined;
			if (nodeId) {
				const officialLavalink = await this.client.dbNew.getOfficialLavalink(nodeId);
				const guildLavalink = await this.client.dbNew.getGuildLavalink(guild!.id, nodeId);
				const lavalink = officialLavalink || guildLavalink;
				if (!lavalink) {
					response.error(res, 404, `Lavalink node ${nodeId} not found`);
					return;
				}

				const customNodeOptions: LavalinkNodeOptions = {
					id: `${guild!.id}-${nodeId}`,
					host: lavalink.NodeHost,
					port: lavalink.NodePort,
					authorization: lavalink.NodeAuthorization,
					secure: lavalink.NodeSecure,
					retryAmount: lavalink.NodeRetryAmount,
					retryDelay: lavalink.NodeRetryDelay
				};

				const result = await testConnection(customNodeOptions, this.client.manager.nodeManager);
				if (result.status_code === 'failed') {
					response.error(res, 503, `Failed to connect to ${lavalink.NodeName}: ${result.reason}`);
					return;
				}

				customNode = result.node;
			}

			const newPlayer = this.client.manager.createPlayer({
				guildId: guild!.id,
				voiceChannelId: voiceChannel,
				textChannelId: textChannel,
				selfMute: false,
				selfDeaf: true,
				vcRegion: voiceChannelObj.rtcRegion!,
				node: customNode
			});

			await newPlayer.connect();

			const connected = await waitForPlayerConnection(newPlayer);
			if (!connected) {
				const message = new EmbedBuilder()
					.setDescription('Disconnecting because cannot verify player connection')
					.setColor(this.client.color.main);
				await textChannelObj.send({ embeds: [message] });
				await newPlayer.destroy();
				response.error(res, 500, 'Cannot verify player connection');
				return;
			}

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Joined <#${voiceChannel}> and bound to <#${textChannel}>`)
				.setColor(this.client.color.main);
			await textChannelObj.send({ embeds: [message] });

			response.success(res, {
				message: 'Player created'
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public playerDelete = async (req: GuildRequest, res: Response): Promise<void> => {
		const { guild, player, channel, user } = req;

		try {
			await player!.destroy();

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Disconnected`)
				.setColor(this.client.color.main);
			await channel!.send({ embeds: [message] });

			response.success(res, {
				message: 'Player deleted'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public playerRejoin = async (req: GuildRequest, res: Response): Promise<void> => {
		const { guild, player, channel, user } = req;

		try {
			await player!.connect();

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Reconnected`)
				.setColor(this.client.color.main);
			await channel!.send({ embeds: [message] });

			response.success(res, {
				message: 'Player rejoined'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public track = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			uri: z.string().optional(),
			identifier: z.string().optional(),
			offset: z.number().optional()
		}).refine(data => data.uri || data.identifier, {
			message: "Either uri or identifier must be provided"
		});

		try {
			const { uri, identifier, offset } = schema.parse(req.body || {});
			const { guild, player, channel, user } = req;

			let searchResult: SearchResult | UnresolvedSearchResult;
			if (uri) {
				searchResult = await player!.search({ query: uri }, user || this.client.user);
			} else {
				searchResult = await player!.search({
					query: `https://youtube.com/watch?v=${identifier}`,
					source: 'youtube'
				}, user || this.client.user);
			}

			if (!searchResult.tracks?.length) {
				response.error(res, 404, 'No tracks found');
				return;
			}

			const track = searchResult.tracks[0];
			await player!.queue.add(track, offset);

			if (!player!.playing) player!.play({ paused: false });

			this.client.socket.io.to(player!.guildId).emit('player:queueUpdate:success', {
				queue: mapTracks(player!.queue.tracks as Track[] || [])
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Added [${track.info.title}](${track.info.uri})`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: `Added track: ${track.info.title}`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public trackDelete = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;
			const position = Number.parseInt(req.params.position, 10);

			if (!player!.queue.current) {
				response.error(res, 404, `No music is playing right now for guild id: ${guild!.id}`);
				return;
			}

			if (position < 0 || position >= player!.queue.tracks.length) {
				response.error(res, 400, `Invalid position: ${position}`);
				return;
			}

			const track = player!.queue.tracks[position];
			player!.queue.remove(position);

			this.client.socket.io.to(player!.guildId).emit('player:queueUpdate:success', {
				queue: mapTracks(player!.queue.tracks as Track[] || [])
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Removed [${track.info.title}](${track.info.uri})`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: `Removed track: ${track.info.title}`
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public trackRecommended = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { player } = req;

			if (req.query.identifier) {
				const uri = `https://music.youtube.com/watch?v=${req.query.identifier}&list=RD${req.query.identifier}`;
				const search = player ? await player.search({ query: uri }, null, false) : await this.client.manager.search(uri, undefined);
				const mappedResult = mapTracks(search.tracks as Track[]);

				response.success(res, { search: { tracks: mappedResult } });
				return;
			}

			const identifier = player!.queue.current?.info.identifier;
			if (!identifier) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			const uri = `https://youtube.com/watch?v=${identifier}&list=RD${identifier}`;
			const search = player ? await player.search({ query: uri }, null, false) : await this.client.manager.search(uri, undefined);
			const mappedResult = mapTracks(search.tracks as Track[]);

			response.success(res, { search: { tracks: mappedResult } });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public seek = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			position: z.coerce.number().min(0)
		});

		try {
			const { position } = schema.parse(req.body || {});
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (position > player!.queue.current.info.duration) {
				response.error(res, 400, 'Position exceeds track duration');
				return;
			}

			await player!.seek(Number.parseInt(position.toString(), 10));

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
				position
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Seeked to ${this.client.utils.formatTime(position)}`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: `Seeked to ${this.client.utils.formatTime(position)}`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public pause = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (player!.paused) {
				response.error(res, 400, 'Player is already paused');
				return;
			}

			await player!.pause();

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: true,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Paused the player`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Paused the player'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public unpause = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (!player!.paused) {
				response.error(res, 400, 'Player is not paused');
				return;
			}

			await player!.resume();

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: false,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Resumed the player`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Resumed the player'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public next = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (player!.queue.tracks.length) {
				await player!.skip();
				if (!player!.playing) await player!.play({ paused: false });
			} else {
				await player!.stopPlaying();
			}

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
			});
			this.client.socket.io.to(player!.guildId).emit('player:queueUpdate:success', {
				queue: mapTracks(player!.queue.tracks as Track[] || [])
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Skipped to next track`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Skipped to next track'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public previous = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			await player!.seek(0);

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
				position: 0
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Rewound the track`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Rewound the track'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public loop = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (player!.repeatMode === 'track') {
				response.error(res, 400, 'Track is already looping');
				return;
			}

			player!.setRepeatMode('track');

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: true,
				track: mapTrack(player!.queue.current as Track),
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Enabled track loop`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Enabled track loop'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public unloop = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			if (player!.repeatMode === 'off') {
				response.error(res, 400, 'Track is not looping');
				return;
			}

			player!.setRepeatMode('off');

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: false,
				track: mapTrack(player!.queue.current as Track),
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Disabled track loop`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Disabled track loop'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public shuffle = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild, player, channel, user } = req;

			if (!player!.queue.current) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			player!.queue.shuffle();

			this.client.socket.io.to(player!.guildId).emit('player:playerUpdate:success', {
				paused: player!.paused,
				repeat: player!.repeatMode === 'track',
				track: mapTrack(player!.queue.current as Track),
			});
			this.client.socket.io.to(player!.guildId).emit('player:queueUpdate:success', {
				queue: mapTracks(player!.queue.tracks as Track[] || [])
			});

			const message = new EmbedBuilder()
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild!.id}/room)]`} Shuffled the queue`)
				.setColor(this.client.color.main);

			if (!player!.get('silentMode')) {
				await channel!.send({ embeds: [message] });
			}

			response.success(res, {
				message: 'Shuffled the queue'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public lyrics = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { player } = req;
			const title = player!.queue.current?.info.title;

			if (!title) {
				response.error(res, 404, 'No music is playing right now');
				return;
			}

			const lyrics = await player!.getCurrentLyrics();
			if (!lyrics) {
				response.error(res, 404, `No lyrics found for ${title}`);
				return;
			}

			response.error(res, 500, 'This feature is under maintenance.');
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public history = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { guild } = req;
			const history = await this.client.dbNew.getGuildHistory(guild!.id);

			if (!history) {
				response.error(res, 404, 'No history found');
				return;
			}

			response.success(res, {
				guildId: guild!.id,
				tracks: (history.Tracks as any[])?.reverse()
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};
}

export default MusicController;
