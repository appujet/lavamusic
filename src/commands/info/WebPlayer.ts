import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command, type Context, type Lavamusic } from '../../structures/index';

export default class Webplayer extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: 'webplayer',
			description: {
				content: 'cmd.webplayer.description',
				examples: ['webplayer'],
				usage: 'webplayer',
			},
			category: 'info',
			aliases: ['wp'],
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
		const buttonWebPlayer = new ButtonBuilder()
			.setLabel('Web Player')
			.setStyle(ButtonStyle.Link)
			.setURL(`${client.env.WEB_PLAYER_URL}/guild/${ctx.guild.id}/room`);
		return await ctx.sendMessage({
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonWebPlayer)],
		});
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
