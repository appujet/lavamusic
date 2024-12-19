import { Command, type Context, type Lavamusic } from '../../structures/index';
import { EmbedBuilder } from 'discord.js';

export default class Maintenence extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: 'maintenence',
			description: {
				content: 'Send a message to all players',
				examples: ['maintenence'],
				usage: 'maintenence',
			},
			category: 'dev',
			aliases: ['mt'],
			cooldown: 3,
			args: false,
			player: {
				voice: false,
				dj: false,
				active: false,
				djPerm: null,
			},
			permissions: {
				dev: true,
				client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
				user: [],
			},
			slashCommand: false,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const players = client.manager.players;
		if (!players.size) {
			const embed = new EmbedBuilder()
				.setDescription('No active players found')
				.setColor(client.color.main);
			return ctx.sendMessage({ embeds: [embed] });
		}

		const maintenanceEmbed = new EmbedBuilder()
			.setTitle('🛠️ Scheduled Maintenance Notice')
			.setDescription('Scheduled maintenance will be performed on the bot. Music playback may be temporarily interrupted during this time.')
			.setColor(client.color.main)
			.setTimestamp();

		let sentCount = 0;
		for (const [, player] of players) {
			const textChannel = client.channels.cache.get(player.textChannelId!);
			if (textChannel?.isTextBased() && 'send' in textChannel) {
				await textChannel.send({ embeds: [maintenanceEmbed] });
				sentCount++;
			}
		}

		const responseEmbed = new EmbedBuilder()
			.setDescription(`Sent maintenance notice to ${sentCount} players`)
			.setColor(client.color.main);
		return ctx.sendMessage({ embeds: [responseEmbed] });
	}
}