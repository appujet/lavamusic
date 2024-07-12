import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Prefix extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "prefix",
            description: {
                content: "Shows or sets the bot's prefix",
                examples: ["prefix set !", "prefix reset"],
                usage: "prefix [set <prefix> | reset]",
            },
            category: "general",
            aliases: ["pf"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "Sets the prefix",
                    type: 1,
                    options: [
                        {
                            name: "prefix",
                            description: "The prefix you want to set",
                            type: 3,
                            required: true,
                        },
                    ],
                },
                {
                    name: "reset",
                    description: "Resets the prefix to the default one",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed().setColor(client.color.main);
        const guildId = ctx.guild.id;
        const guildData = await client.db.get(guildId);
        const isInteraction = ctx.isInteraction;
        let subCommand = "";
        let prefix = "";
        if (isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            prefix = ctx.interaction.options.data[0].options[0]?.value.toString();
        } else {
            subCommand = args[0] || "";
            prefix = args[1] || "";
        }
        switch (subCommand) {
            case "set": {
                if (!prefix) {
                    const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                    embed.setDescription(`The prefix for this server is \`${currentPrefix}\``);
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                if (prefix.length > 3) {
                    embed.setDescription("The prefix cannot be longer than 3 characters.");
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                client.db.setPrefix(guildId, prefix);
                embed.setDescription(`The prefix for this server is now \`${prefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }
            case "reset": {
                const defaultPrefix = client.config.prefix;
                client.db.setPrefix(guildId, defaultPrefix);
                embed.setDescription(`The prefix for this server is now \`${defaultPrefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }
            default: {
                const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                embed.setDescription(`The prefix for this server is \`${currentPrefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }
        }
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
