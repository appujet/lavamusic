import { PermissionsBitField } from 'discord.js';
import type Lavamusic from '@/structures/Lavamusic';
import type { Socket } from 'socket.io';

export default function userHandler(socket: Socket, client: Lavamusic): void {
	socket.on('user:permissions', async (guildId: string, userId: string) => {
		if (!guildId) {
			socket.emit('user:permissions:error', 'No guildId provided');
			return;
		}

		if (!userId) {
			socket.emit('user:permissions:error', 'No userId provided');
			return;
		}

		try {
			const guild = client.guilds.cache.get(guildId);
			if (!guild) {
				socket.emit('user:permissions:error', 'Guild not found');
				return;
			}

			const member = await guild.members.fetch({ user: userId, force: true });
			if (!member) {
				socket.emit('user:permissions:error', 'Member not found');
				return;
			}

			socket.join(`${guildId}-${userId}`);

			let permission = { type: 1000, name: 'Member' };

			if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				permission = { type: 0, name: 'Administrator' };
			} else if (member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				permission = { type: 10, name: 'Guild Manager' };
			} else {
				const guildDj = await client.dbNew.getGuildDj(guildId);
				if (guildDj?.Roles) {
					const roles = guildDj.Roles as string[];
					if (roles.some(djRole => member.roles.cache.has(djRole))) {
						permission = { type: 100, name: 'DJ' };
					}
				}
			}

			socket.emit('user:permissions:success', permission);
		} catch (error) {
			socket.emit('user:permissions:error', error instanceof Error ? error.message : 'Unknown error occurred');
		}
	});
}
