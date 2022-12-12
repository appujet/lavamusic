import { checkURL } from "../../handlers/functions.js";
import Command from "../../structures/Command.js";

export default class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            description: {
                content: 'To play a song.',
                usage: 'play <song name>',
                examples: ['play despacito'],
            },
            aliases: ['p'],
            category: 'music',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'Connect', 'Speak'],
                user: [],
            },
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            slashCommand: true,
            options: [
                {
                    name: 'song',
                    description: 'The song you want to play.',
                    type: 3,
                    required: true,
                }
            ]
        });
    }
    async run(ctx, args) {
        const query = args.length > 1 ? args.join(' ') : args[0];
        const isURL = checkURL(query);
        const player = await this.client.manager.create(ctx.guild, ctx.member, ctx.channel)
        const res = await this.client.manager.search(isURL ? query : `ytmsearch:${query}`);
        const embed = this.client.embed()

        switch (res.loadType) {
            case 'LOAD_FAILED':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription('There was an error while searching.')] });
                break;
            case 'NO_MATCHES':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription('There were no results found.')] });
                break;
            case 'TRACK_LOADED':
                player.queue.push(res.tracks[0]);
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Added ${res.tracks[0].info.title} to the queue.`)] });
                break;
            case 'PLAYLIST_LOADED':
                player.queue.push(res.tracks);
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Added ${res.tracks.length} songs to the queue.`)] });
                break;
            case 'SEARCH_RESULT':
                player.queue.push(res.tracks[0]);
                await player.isPlaying()
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Added ${res.tracks[0].info.title} to the queue.`)] });
                break;
        }

    }
}
