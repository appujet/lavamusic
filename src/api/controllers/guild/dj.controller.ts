import type { Request, Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { PermissionsBitField } from 'discord.js';
import { z } from 'zod';

class DjController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	private async memberPermissionsUpdate(guildId: string, roleId?: string): Promise<void> {
		const guild = this.client.guilds.cache.get(guildId);
		if (!guild) return;

		const members = await guild.members.fetch();
		for (const [, guildMember] of members) {
			if (roleId && !guildMember.roles.cache.has(roleId)) continue;

			let permission = { type: 1000, name: 'Member' };

			if (guildMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
				permission = { type: 0, name: 'Administrator' };
			} else if (guildMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				permission = { type: 10, name: 'Guild Manager' };
			} else {
				const guildDj = await this.client.dbNew.getGuildDj(guildId);
				if (guildDj?.Roles) {
					const roles = guildDj.Roles as string[];
					if (roles.some(djRole => guildMember.roles.cache.has(djRole))) {
						permission = { type: 100, name: 'DJ' };
					}
				}
			}

			this.client.socket.io.to(`${guildId}-${guildMember.id}`).emit('user:permissions:success', permission);
		}
	}

	public home = (_req: Request, res: Response): void => {
		response.success(res, {
			message: 'Guild Route -> Dj',
		});
	};

	public getDj = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const guildDj = await this.client.dbNew.getGuildDj(req.guild!.id);

			response.success(res, {
				guildId: req.guild!.id,
				mode: guildDj?.Mode ?? false,
				roles: guildDj?.Roles || [],
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public updateDjMode = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			mode: z.string().refine(val => val === 'true' || val === 'false', {
				message: "mode must be either 'true' or 'false'",
			}).transform(val => val === 'true'),
		});

		try {
			const { mode } = schema.parse(req.body ?? {});
			let guildDj = await this.client.dbNew.getGuildDj(req.guild!.id);

			if (!guildDj) {
				response.error(res, 404, 'DJ setup not found for this guild');
				return;
			}

			guildDj = await this.client.dbNew.updateGuildDj(req.guild!.id, {
				Mode: mode,
				Roles: guildDj.Roles,
			});

			this.client.socket.io.to(req.guild!.id).emit('guild:guildDj:success', {
				mode: guildDj.Mode,
				roles: guildDj.Roles,
			});

			response.success(res, {
				message: 'DJ Mode Updated',
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public addDjRole = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			roleId: z.string().min(1, 'Role ID must not be empty'),
		});

		try {
			const { roleId } = schema.parse(req.body ?? {});
			let guildDj = await this.client.dbNew.getGuildDj(req.guild!.id);

			if (guildDj?.Roles && (guildDj.Roles as string[]).includes(roleId)) {
				response.error(res, 400, `Role ${roleId} already added`);
				return;
			}

			if (guildDj) {
				guildDj = await this.client.dbNew.updateGuildDj(req.guild!.id, {
					Mode: guildDj.Mode,
					Roles: [...(guildDj.Roles as string[] || []), roleId]
				});
			} else {
				guildDj = await this.client.dbNew.createGuildDj(req.guild!.id, {
					Mode: true,
					Roles: [roleId],
				});
			}

			this.client.socket.io.to(req.guild!.id).emit('guild:guildDj:success', {
				mode: guildDj.Mode,
				roles: guildDj.Roles,
			});

			await this.memberPermissionsUpdate(req.guild!.id, roleId);

			response.success(res, {
				message: 'DJ Role Added',
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public removeDjRole = async (req: GuildRequest, res: Response): Promise<void> => {
		const roleId = req.params.roleId;

		try {
			const guildDj = await this.client.dbNew.getGuildDj(req.guild!.id);

			if (!guildDj) {
				response.error(res, 404, 'DJ setup not found for this guild');
				return;
			}

			const roles = guildDj.Roles as string[];
			if (!roles.includes(roleId)) {
				response.error(res, 404, `Role ${roleId} not found`);
				return;
			}

			const updatedRoles = roles.filter(r => r !== roleId);

			if (updatedRoles.length) {
				const updatedGuildDj = await this.client.dbNew.updateGuildDj(req.guild!.id, {
					Mode: guildDj.Mode,
					Roles: updatedRoles
				});

				this.client.socket.io.to(req.guild!.id).emit('guild:guildDj:success', {
					mode: updatedGuildDj.Mode,
					roles: updatedGuildDj.Roles,
				});
			} else {
				await this.client.dbNew.updateGuildDj(req.guild!.id, {
					Mode: false,
					Roles: []
				});

				this.client.socket.io.to(req.guild!.id).emit('guild:guildDj:success', {
					mode: false,
					roles: [],
				});
			}

			await this.memberPermissionsUpdate(req.guild!.id, roleId);

			response.success(res, {
				message: 'DJ Role Removed',
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};
}

export default DjController;
