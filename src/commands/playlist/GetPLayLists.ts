import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class GetPlaylists extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "playlists",
            description: {
                content: "Retrieves all playlists for the user",
                examples: ["playlists"],
                usage: "playlists",
            },
            category: "playlist",
            aliases: ["playlists"],
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
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        try {
            const userId = ctx.author.id;
            const playlists = await client.db.getUserPlaylists(userId);

            if (!playlists || playlists.length === 0) {
                const noPlaylistsMessage = this.client.embed().setDescription("[You have no playlists]").setColor(this.client.color.red);
                return await ctx.sendMessage({ embeds: [noPlaylistsMessage] });
            }

            const playlistNames = playlists.map((playlist: any) => playlist.name).join("\n");
            const successMessage = this.client
                .embed()
                .setTitle("Your Playlists")
                .setDescription(playlistNames)
                .setColor(this.client.color.green);
            await ctx.sendMessage({ embeds: [successMessage] });
        } catch (error) {
            console.error(error);
            const errorMessage = this.client.embed().setDescription("[An error occurred while retrieving your playlists]").setColor(this.client.color.red);
            await ctx.sendMessage({ embeds: [errorMessage] });
        }
    }
}
