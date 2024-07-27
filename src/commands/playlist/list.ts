import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class GetPlaylists extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "list",
            description: {
                content: "Retrieves all playlists for the user",
                examples: ["list", "list @user"],
                usage: "list [@user]",
            },
            category: "playlist",
            aliases: ["lst"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "user",
                    description: "The user whose playlists you want to retrieve",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        try {
            let userId = ctx.author.id;
            let targetUser = ctx.args[0];

            if (targetUser?.startsWith("<@") && targetUser.endsWith(">")) {
                targetUser = targetUser.slice(2, -1);
                if (targetUser.startsWith("!")) targetUser = targetUser.slice(1);
                targetUser = await client.users.fetch(targetUser);
                userId = targetUser.id;
            }

            const playlists = await client.db.getUserPlaylists(userId);

            if (!playlists || playlists.length === 0) {
                return await ctx.sendMessage({
                    embeds: [
                        {
                            description: "This user has no playlists",
                            color: this.client.color.red,
                        },
                    ],
                });
            }

            const targetUsername = targetUser ? targetUser.username : "Your";
            return await ctx.sendMessage({
                embeds: [
                    {
                        title: `${targetUsername}'s Playlists`,
                        description: playlists.map((playlist: any) => playlist.name).join("\n"),
                        color: this.client.color.green,
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "An error occurred while retrieving the playlists",
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
