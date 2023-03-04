import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Play extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "play",
            description: {
                content: "Plays a song from YouTube or Spotify",
                examples: ["play https://www.youtube.com/watch?v=QH2-TGUlwu4", "play https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg"],
                usage: "play <song>"
            },
            category: "music",
            aliases: ["p"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
                user: []
            },
            slashCommand: true,
            options: [
                {
                    name: "song",
                    description: "The song you want to play",
                    type: 3,
                    required: true
                }
            ]
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const query = args.join(" ");
        let player = client.manager.getPlayer(ctx.guild.id);

        if (!player) player = await client.manager.create(ctx.guild, ctx.member, ctx.channel, client.manager.shoukaku.getNode());

        const res = await this.client.manager.search(query);
        const embed = this.client.embed();
        switch (res.loadType) {
            case 'LOAD_FAILED':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription('There was an error while searching.')] });
                break;
            case 'NO_MATCHES':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription('There were no results found.')] });
                break;
            case 'TRACK_LOADED':
                const track = player.buildTrack(res.tracks[0], ctx.author);
                player.queue.push(track);
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`)] });
                break;
            case 'PLAYLIST_LOADED':
                for (const track of res.tracks) {
                    const pl = player.buildTrack(track, ctx.author);
                    player.queue.push(pl);
                }
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Added ${res.tracks.length} songs to the queue.`)] });
                break;
            case 'SEARCH_RESULT':
                const track1 = player.buildTrack(res.tracks[0], ctx.author);
                player.queue.push(track1);
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`)] });
                break;
        }

    }
};