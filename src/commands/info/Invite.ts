import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Invite extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "invite",
            description: {
                content: "Sends the bot's invite link",
                examples: ["invite"],
                usage: "invite",
            },
            category: "info",
            aliases: ["inv"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Invite")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${client.config.clientId}&permissions=8&scope=bot%20applications.commands`,
                ),
            new ButtonBuilder().setLabel("My Server").setStyle(ButtonStyle.Link).setURL("https://discord.gg/STXurwnZD5"),
        );

        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription("You can invite me by clicking the button below. Any bugs or outages? Join the support server!"),
            ],
            components: [row],
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
