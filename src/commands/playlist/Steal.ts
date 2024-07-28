import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class StealPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "steal",
            description: {
                content: "cmd.steal.description",
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
                    description: "cmd.steal.options.playlist",
                    type: 3,
                    required: true,
                },
                {
                    name: "user",
                    description: "cmd.steal.options.user",
                    type: 6, // USER type
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlistName = args.shift();
        let targetUserId: string | null = null;
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
        }

        if (!playlistName) {
            const errorMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.steal.messages.provide_playlist"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!targetUserId) {
            const errorMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.steal.messages.provide_user"))
                .setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        try {
            const targetPlaylist = await client.db.getPlaylist(targetUserId, playlistName);

            if (!targetPlaylist) {
                const playlistNotFoundError = this.client
                    .embed()
                    .setDescription(ctx.locale("cmd.steal.messages.playlist_not_exist"))
                    .setColor(this.client.color.red);
                return await ctx.sendMessage({ embeds: [playlistNotFoundError] });
            }

            const targetSongs = await client.db.getSongs(targetUserId, playlistName);
            await client.db.createPlaylistWithSongs(ctx.author.id, playlistName, targetSongs);

            const successMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.steal.messages.playlist_stolen", { playlist: playlistName, user: targetUser.username }))
                .setColor(this.client.color.green);
            await ctx.sendMessage({ embeds: [successMessage] });
        } catch (error) {
            console.error(error);
            const errorMessage = this.client
                .embed()
                .setDescription(ctx.locale("cmd.steal.messages.error_occurred"))
                .setColor(this.client.color.red);
            await ctx.sendMessage({ embeds: [errorMessage] });
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
