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
                    type: 6, // USER type
                    required: false,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        try {
            let userId;
            let targetUser = ctx.args[0];

            if (targetUser && targetUser.startsWith('<@') && targetUser.endsWith('>')) {
                targetUser = targetUser.slice(2, -1);

                if (targetUser.startsWith('!')) {
                    targetUser = targetUser.slice(1);
                }

                targetUser = await client.users.fetch(targetUser);
                userId = targetUser.id;
            } else if (targetUser) {
                targetUser = await client.users.fetch(ctx.args[0]);
            } else {
                userId = ctx.author.id;
            }

            const playlists = await client.db.getUserPlaylists(userId);

            if (!playlists || playlists.length === 0) {
                const noPlaylistsMessage = this.client.embed().setDescription("[This user has no playlists]").setColor(this.client.color.red);
                return await ctx.sendMessage({ embeds: [noPlaylistsMessage] });
            }

            const targetUsername = targetUser ? targetUser.username : "Your";
            const successMessage = this.client
                .embed()
                .setTitle(`${targetUsername}'s Playlists`)
                .setDescription(playlists.map((playlist: any) => playlist.name).join("\n"))
                .setColor(this.client.color.green);
            await ctx.sendMessage({ embeds: [successMessage] });
        } catch (error) {
            console.error(error);
            const errorMessage = this.client.embed().setDescription("[An error occurred while retrieving the playlists]").setColor(this.client.color.red);
            await ctx.sendMessage({ embeds: [errorMessage] });
        }
    }
}
