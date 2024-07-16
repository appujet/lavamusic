import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Ping extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "ping",
            description: {
                content: "cmd.ping.description",
                examples: ["ping"],
                usage: "ping",
            },
            category: "general",
            aliases: ["pong"],
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

    public async run(_client: Lavamusic, ctx: Context): Promise<any> {
        const msg = await ctx.sendDeferMessage(ctx.locale("cmd.ping.content"));
        const embed = this.client
            .embed()
            .setAuthor({ name: "Pong", iconURL: this.client.user.displayAvatarURL() })
            .setColor(this.client.color.main)
            .addFields([
                {
                    name: ctx.locale("cmd.ping.bot_latency"),
                    value: `\`\`\`ini\n[ ${msg.createdTimestamp - ctx.createdTimestamp}ms ]\n\`\`\``,
                    inline: true,
                },
                {
                    name: ctx.locale("cmd.ping.api_latency"),
                    value: `\`\`\`ini\n[ ${Math.round(ctx.client.ws.ping)}ms ]\n\`\`\``,
                    inline: true,
                },
            ])
            .setFooter({
                text: ctx.locale("cmd.ping.requested_by", { author: ctx.author.tag }),
                iconURL: ctx.author.avatarURL({}),
            })
            .setTimestamp();
        return await ctx.editMessage({ content: "", embeds: [embed] });
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
