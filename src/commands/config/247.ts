import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class _247 extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "247",
            description: {
                content: "set the bot to stay in the vc",
                examples: ["247"],
                usage: "247"
            },
            category: "config",
            aliases: ["stay"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ['ManageGuild']
            },
            slashCommand: true,
            options: []
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
        const embed = client.embed()
        let player = client.shoukaku.players.get(ctx.guild.id) as any;
        
        const data = await client.prisma.stay.findFirst({
            where: {
                guildId: ctx.guild.id
            }
        });
        const vc = ctx.member as any;
        if (!data) {
            await client.prisma.stay.create({
                data: {
                    guildId: ctx.guild.id,
                    textId: ctx.channel.id,
                    voiceId: vc.voice.channelId
                }
            })
            if (!player) player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());
            return ctx.sendMessage({ embeds: [embed.setDescription(`**247 mode has been enabled**`).setColor(client.color.main)] });
        } else {
            await client.prisma.stay.delete({
                where: {
                    guildId: ctx.guild.id
                }
            });
           
            return ctx.sendMessage({ embeds: [embed.setDescription(`**247 mode has been disabled**`).setColor(client.color.red)] });
        }
    }
};

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */