import { Command, type Context, type Lavamusic } from '../../structures/index';

export default class Help extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: 'help',
			description: {
				content: 'cmd.help.description',
				examples: ['help'],
				usage: 'help',
			},
			category: 'info',
			aliases: ['h'],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: false,
				dj: false,
				active: false,
				djPerm: null,
			},
			permissions: {
				dev: false,
				client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const embed = this.client
			.embed()
			.setColor(this.client.color.main)
			.setTitle('TSR Discord Music Bot')
			.setDescription(`
				Hello, I'm TSR Discord Music Bot. 
				To get started, visit the **[Web Player](${client.env.WEB_PLAYER_URL}/guild/${ctx.guild.id}/room)**
				\n${client.env.WEB_PLAYER_URL}/guild/${ctx.guild.id}/room
			`);
		return await ctx.sendMessage({ embeds: [embed] });
	}
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
