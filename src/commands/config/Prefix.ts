import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Prefix extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "prefix",
            description: {
                content: "Shows the bot's prefix",
                examples: ["prefix", "prefix reset", "prefix !"],
                usage: "prefix, prefix reset, prefix !"
            },
            category: "general",
            aliases: ["prefix"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
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
            options: [
                {
                    name: "prefix",
                    description: "The prefix you want to set",
                    type: 3,
                    required: false
                },
                {
                    name: "reset",
                    description: "Resets the prefix to the default",
                    type: 1,
                }
            ]
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
        
        const pre = args[0];
        const embed = client.embed().setColor(client.color.main)
        let prefix = await this.client.prisma.guild.findUnique({
            where: {
                guildId: ctx.guild.id
            }
        }) as any;
        if (pre === "reset") {
            if (!prefix) return await ctx.sendMessage({ embeds: [embed.setDescription(`The prefix for this server is \`${client.config.prefix}\``)] })
            prefix = await this.client.prisma.guild.delete({
                where: {
                    guildId: ctx.guild.id
                },
            });
            return await ctx.sendMessage({ embeds: [embed.setDescription(`The prefix for this server is now \`${client.config.prefix}\``)] })
        }
        if (!pre) {
            embed.setDescription(`The prefix for this server is \`${prefix ? prefix.prefix : client.config.prefix}\``)
            return await ctx.sendMessage({ embeds: [embed] })
        }
        if (pre.length > 3) return await ctx.sendMessage({ embeds: [embed.setDescription(`The prefix can't be longer than 3 characters`)] })
        
        if (!prefix) {
            prefix = await this.client.prisma.guild.create({
                data: {
                    guildId: ctx.guild.id,
                    prefix: pre
                }
            });
            return await ctx.sendMessage({ embeds: [embed.setDescription(`The prefix for this server is now \`${prefix.prefix}\``)] })
        } else {
            prefix = await this.client.prisma.guild.update({
                where: {
                    guildId: ctx.guild.id
                },
                data: {
                    prefix: pre
                }
            });
            return await ctx.sendMessage({ embeds: [embed.setDescription(`The prefix for this server is now \`${prefix.prefix}\``)] })
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