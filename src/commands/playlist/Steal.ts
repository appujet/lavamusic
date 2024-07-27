import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class StealPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "steal",
            description: {
                content: "Steals a playlist from another user and adds it to your playlists",
                examples: ["steal <playlist_name> <@user>"],
                usage: "steal <playlist_name> <@user>",
            },
            category: "playlist",
            aliases: ["st"],
            cooldown: 3,
            args: true,
            vote: false,
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
            options: [
                {
                    name: "playlist",
                    description: "The playlist you want to steal",
                    type: 3,
                    required: true,
                },
                {
                    name: "user",
                    description: "The user from whom you want to steal the playlist",
                    type: 6,
                    required: true, // 6 represents a USER type in Discord API
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlistName = args.shift();
        let targetUserId: any;
        let targetUser = ctx.args[0];

        if (targetUser?.startsWith("<@") && targetUser.endsWith(">")) {
            targetUser = targetUser.slice(2, -1);

            if (targetUser.startsWith("!")) {
                targetUser = targetUser.slice(1);
            }

            targetUser = await client.users.fetch(targetUser);
            targetUserId = targetUser.id;
        } else if (targetUser) {
            targetUser = await client.users.fetch(ctx.args[0]);
            targetUserId = targetUser.id;
        } else {
            targetUserId = ctx.author.id;
        }

        if (!playlistName) {
            const errorMessage = this.client.embed().setDescription("[Please provide a playlist name]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!targetUser) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "[Please mention a user]",
                        color: this.client.color.red,
                    },
                ],
            });
        }

        try {
            const targetPlaylist = await client.db.getPlaylist(targetUserId, playlistName);

            if (!targetPlaylist) {
                return await ctx.sendMessage({
                    embeds: [
                        {
                            description: "[That playlist doesn't exist for the mentioned user]",
                            color: this.client.color.red,
                        },
                    ],
                });
            }

            const targetSongs = await client.db.getSongs(targetUserId, playlistName);
            await client.db.createPlaylistWithSongs(ctx.author.id, playlistName, targetSongs);

            return await ctx.sendMessage({
                embeds: [
                    {
                        description: `[Successfully stole the playlist "${playlistName}" from ${targetUser.username}]`,
                        color: this.client.color.green,
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "[An error occurred while stealing the playlist]",
                        color: this.client.color.red,
                    },
                ],
            });
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
