import { Command, type Context, type Lavamusic } from "../../structures/index.js";
import { getLyrics } from 'genius-lyrics-api';

export default class Lyrics extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "lyrics",
            description: {
                content: "cmd.lyrics.description",
                examples: ["lyrics"],
                usage: "lyrics",
            },
            category: "music",
            aliases: ["ly"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client.embed();
        
        if (!player || !player.isPlaying) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.lyrics.errors.no_playing"))],
            });
        }
    
        const currentTrack = player.current;
        const trackTitle = currentTrack.info.title;
        const artistName = currentTrack.info.author;
        const trackUrl = currentTrack.info.uri
        const artworkUrl = currentTrack.info.artworkUrl;
    
        const options = {
            apiKey: this.client.config.lyricsApi,
            title: trackTitle,
            artist: artistName,
            optimizeQuery: true
        };
    
        try {
            const lyrics = await getLyrics(options);
            if (lyrics) {
                await ctx.sendMessage({
                    embeds: [embed.setColor(this.client.color.main).setDescription(ctx.locale("cmd.lyrics.lyrics_track", { trackTitle, trackUrl, lyrics})).setThumbnail(artworkUrl).setTimestamp()],
                });
            } else {
                await ctx.sendMessage({
                    embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.lyrics.errors.no_results"))],
                });
            }
        } catch (error) {
            console.error(error);
            await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.lyrics.errors.lyrics_error"))],
            });
        }
    }
}
