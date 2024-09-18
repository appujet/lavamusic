import { ChannelType, OverwriteType, PermissionFlagsBits } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";
import { getButtons } from "../../utils/Buttons";

export default class Setup extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "setup",
            description: {
                content: "cmd.setup.description",
                examples: ["setup create", "setup delete", "setup info"],
                usage: "setup",
            },
            category: "config",
            aliases: ["set"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "ManageChannels"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "create",
                    description: "cmd.setup.options.create",
                    type: 1,
                },
                {
                    name: "delete",
                    description: "cmd.setup.options.delete",
                    type: 1,
                },
                {
                    name: "info",
                    description: "cmd.setup.options.info",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const subCommand = ctx.isInteraction ? ctx.interaction.options.data[0].name : args[0];
        const embed = client.embed().setColor(this.client.color.main);
        switch (subCommand) {
            case "create": {
                const data = await client.db.getSetup(ctx.guild!.id);
                if (data?.textId && data.messageId) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: ctx.locale("cmd.setup.errors.channel_exists"),
                                color: client.color.red,
                            },
                        ],
                    });
                }
                const textChannel = await ctx.guild.channels.create({
                    name: `${this.client.user.username}-song-requests`,
                    type: ChannelType.GuildText,
                    topic: "Song requests for the music bot.",
                    permissionOverwrites: [
                        {
                            type: OverwriteType.Member,
                            id: this.client.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.EmbedLinks,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                        {
                            type: OverwriteType.Role,
                            id: ctx.guild.roles.everyone.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                });
                const player = this.client.manager.getPlayer(ctx.guild!.id);
                const image = this.client.config.links.img;
                const desc = player?.queue.current
                    ? `[${player.queue.current.info.title}](${player.queue.current.info.uri})`
                    : ctx.locale("player.setupStart.nothing_playing");
                embed.setDescription(desc).setImage(image);
                await textChannel
                    .send({
                        embeds: [embed],
                        components: getButtons(player, client),
                    })
                    .then((msg) => {
                        client.db.setSetup(ctx.guild!.id, textChannel.id, msg.id);
                    });
                await ctx.sendMessage({
                    embeds: [
                        {
                            description: ctx.locale("cmd.setup.messages.channel_created", { channelId: textChannel.id }),
                            color: this.client.color.main,
                        },
                    ],
                });
                break;
            }
            case "delete": {
                const data2 = await client.db.getSetup(ctx.guild!.id);
                if (!data2) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: ctx.locale("cmd.setup.errors.channel_not_exists"),
                                color: client.color.red,
                            },
                        ],
                    });
                }
                client.db.deleteSetup(ctx.guild!.id);
                const textChannel = ctx.guild.channels.cache.get(data2.textId);
                if (textChannel) await textChannel.delete().catch(() => {});
                await ctx.sendMessage({
                    embeds: [
                        {
                            description: ctx.locale("cmd.setup.messages.channel_deleted"),
                            color: this.client.color.main,
                        },
                    ],
                });
                break;
            }
            case "info": {
                const data3 = await client.db.getSetup(ctx.guild!.id);
                if (!data3) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: ctx.locale("cmd.setup.errors.channel_not_exists"),
                                color: client.color.red,
                            },
                        ],
                    });
                }
                const channel = ctx.guild.channels.cache.get(data3.textId);
                if (channel) {
                    embed.setDescription(
                        ctx.locale("cmd.setup.messages.channel_info", {
                            channelId: channel.id,
                        }),
                    );
                    await ctx.sendMessage({ embeds: [embed] });
                } else {
                    await ctx.sendMessage({
                        embeds: [
                            {
                                description: ctx.locale("cmd.setup.errors.channel_not_exists"),
                                color: client.color.red,
                            },
                        ],
                    });
                }
                break;
            }
            default:
                break;
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
