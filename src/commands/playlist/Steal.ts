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
        let _userId;
        let targetUser = ctx.args[0];

        if (targetUser?.startsWith("<@") && targetUser.endsWith(">")) {
        
            targetUser = targetUser.slice(2, -1);

            if (targetUser.startsWith('!')) {
                targetUser = targetUser.slice(1);
            }

            targetUser = await client.users.fetch(targetUser);
            _userId = targetUser.id;
        } else if (targetUser) {
            targetUser = await client.users.fetch(ctx.args[0]);
        } else {
            _userId = ctx.author.id;
        }

        if (!playlistName) {
            const errorMessage = this.client.embed().setDescription("[Please provide a playlist name]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!targetUser) {
            const errorMessage = this.client.embed().setDescription("[Please mention a user]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        try {
            const targetUserId = targetUser.id;
            const targetPlaylist = await client.db.getPlaylist(targetUserId, playlistName);

            if (!targetPlaylist) {
                const playlistNotFoundError = this.client.embed().setDescription("[That playlist doesn't exist for the mentioned user]").setColor(this.client.color.red);
                return await ctx.sendMessage({ embeds: [playlistNotFoundError] });
            }

            const targetSongs = await client.db.getSongs(targetUserId, playlistName);
            await client.db.createPlaylistWithSongs(ctx.author.id, playlistName, targetSongs);

            const successMessage = this.client
                .embed()
                .setDescription(`[Successfully stole the playlist "${playlistName}" from ${targetUser.username}]`)
                .setColor(this.client.color.green);
            await ctx.sendMessage({ embeds: [successMessage] });
        } catch (error) {
            console.error(error);
            const errorMessage = this.client.embed().setDescription("[An error occurred while stealing the playlist]").setColor(this.client.color.red);
            await ctx.sendMessage({ embeds: [errorMessage] });
        }
    }
}
