import type { Request, Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { EmbedBuilder } from 'discord.js';
import { z } from 'zod';

class HomeController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public home = (_req: Request, res: Response): void => {
		response.success(res, {
			message: 'Guild Route -> Home',
		});
	};

	public guild = (req: GuildRequest, res: Response): void => {
		const guild = req.guild;

		response.success(res, {
			guild,
		});
	};

	public config = async (req: GuildRequest, res: Response): Promise<void> => {
		const guild = req.guild!;

		const guildConfig = await this.client.dbNew.getGuildConfig(guild.id);

		response.success(res, {
			config: guildConfig?.Config || { AuthMode: false },
		});
	};

	public channels = async (req: GuildRequest, res: Response): Promise<void> => {
		const guild = req.guild!;

		const channels = guild.channels.cache;

		response.success(res, {
			channels: channels,
		});
	};

	public roles = async (req: GuildRequest, res: Response): Promise<void> => {
		const guild = req.guild!;

		const roles = guild.roles.cache;

		response.success(res, {
			roles: roles,
		});
	};

	public authMode = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			authMode: z.string().refine(val => val === 'true' || val === 'false', {
				message: "authMode must be either 'true' or 'false'",
			}).transform(val => val === 'true'),
		});

		try {
			const { authMode } = schema.parse(req.body ?? {});
			const { user, guild, channel } = req;

			const guildConfig = await this.client.dbNew.getGuildConfig(guild!.id);
			if (guildConfig) {
				await this.client.dbNew.updateGuildConfig(guild!.id, { authMode });
			} else {
				await this.client.dbNew.createGuildConfig(guild!.id, { authMode });
			}

			this.client.socket.io.to(guild!.id).emit('guild:guildConfig:success', {
				authMode: authMode,
			});
			const message = new EmbedBuilder()
				.setColor(this.client.config.color.main)
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild?.id}/room)]`} ${authMode ? 'Enabled' : 'Disabled'} authentication mode`);
			await channel?.send({ embeds: [message] });

			response.success(res, {
				message: 'Authentication mode updated',
			});
		} catch (error) {
			if (error instanceof z.ZodError) response.error(res, 400, zod.formatZodError(error));
			else response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public silentMode = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			silentMode: z.string().refine(val => val === 'true' || val === 'false', {
				message: "silentMode must be either 'true' or 'false'",
			}).transform(val => val === 'true'),
		});

		try {
			const { silentMode } = schema.parse(req.body ?? {});
			const { user, guild, channel, player } = req;

			if (!player) {
				response.error(res, 404, 'Player not found');
				return;
			}

			player.set('silentMode', silentMode);

			this.client.socket.io.to(guild!.id).emit('guild:guildConfig:success', {
				silentMode: silentMode,
			});

			const message = new EmbedBuilder()
				.setColor(this.client.config.color.main)
				.setDescription(`${user?.username ? `[${user.username}]` : `[[Web Player](${process.env.APP_CLIENT_URL}/guild/${guild?.id}/room)]`} ${silentMode ? 'Enabled' : 'Disabled'} silent mode`);
			await channel?.send({ embeds: [message] });

			response.success(res, {
				message: 'Silent mode updated',
			});
		} catch (error) {
			if (error instanceof z.ZodError) response.error(res, 400, zod.formatZodError(error));
			else response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};
}

export default HomeController;