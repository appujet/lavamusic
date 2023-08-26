import { ApplicationCommandOptionType } from 'discord.js';
import { Command, Lavamusic, Context } from "../../structures/index";

export default class Load extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "load",
            description: {
                content: "Loads a playlist",
                examples: ["load <playlist>"],
                usage: "load <playlist>"
            },
            category: "playlist",
            aliases: [],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "The playlist you want to load",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
        let player = client.queue.get(ctx.guild.id);
        const playlist = args.join(" ").replace(/\s/g, "");
        const playlistData = await client.prisma.playlist.findFirst({
            where: {
                userId: ctx.author.id,
                name: playlist
            }
        });
        if (!playlistData) return ctx.sendMessage({
            embeds: [{
                description: "That playlist doesn't exist",
                color: client.color.red
            }]
        });
        for await (const song of playlistData.songs.map(s => JSON.parse(s))) {
            const vc = ctx.member as any;
            if (!player) player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());

            const track = player.buildTrack(song, ctx.author);
            player.queue.push(track);
            player.isPlaying()
        }
        return ctx.sendMessage({
            embeds: [{
                description: `Loaded \`${playlistData.name}\` with \`${playlistData.songs.length}\` songs`,
                color: client.color.main
            }]
        })
    }
}