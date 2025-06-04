import {Command, type Lavamusic} from "../../structures/index";
import {Track} from "lavalink-client";

export default class FairPlay extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'fairplay',
            description: {
                content: 'cmd.fairplay.description',
                examples: ['fairplay'],
                usage: 'fairplay',
            },
            category: 'music',
            aliases: ['fp'],
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
                client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: any): Promise<any> {
        const player = client.manager.getPlayer(ctx.guild!.id);
        if (!player) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale('player.errors.no_player'),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const embed = this.client.embed();
        let fairPlay = player.get<boolean>('fairplay');

        player.set('fairplay', !fairPlay);

        if (fairPlay) {
            embed.setDescription(ctx.locale('cmd.fairplay.messages.disabled')).setColor(this.client.color.main);
        } else {
            embed.setDescription(ctx.locale('cmd.fairplay.messages.enabled')).setColor(this.client.color.main);

            const tracks = [...player.queue.tracks];
            const requesterMap = new Map<string, any[]>();

            // Group tracks by requester
            for (const track of tracks) {
                const requesterId = (track.requester as any).id
                client.logger.log(`Requester ID: ${requesterId}`);
                if (!requesterMap.has(requesterId)) {
                    requesterMap.set(requesterId, []);
                }
                requesterMap.get(requesterId)!.push(track);
            }

            // Build fair queue
            const fairQueue: Track[] = [];
            while (fairQueue.length < tracks.length) {
                for (const [, trackList] of requesterMap.entries()) {
                    if (trackList.length > 0) {
                        fairQueue.push(trackList.shift()!);
                    }
                }
            }

            // Reset queue
            await player.queue.splice(0, player.queue.tracks.length);
            for (const track of fairQueue) {
                client.logger.log(`Adding track to fair queue: ${track.info.title}`);
                player.queue.add(track);
            }
        }

        await ctx.sendMessage({ embeds: [embed] });
    }
}