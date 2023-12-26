import { Event, Lavamusic } from '../../structures/index.js';

export default class NodeConnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeConnect',
        });
    }
    public async run(node: string): Promise<void> {
        this.client.logger.success(`Node ${node} is ready!`);
        const data = await this.client.prisma.stay.findMany();
        if (!data) return;
        for (const main of data) {
            const index = data.indexOf(main);
            setTimeout(async () => {
                const guild = this.client.guilds.cache.get(main.guildId);
                if (!guild) return;
                const channel = guild.channels.cache.get(main.textId);
                if (!channel) return;
                const vc = guild.channels.cache.get(main.voiceId);
                if (!vc) return;
                await this.client.queue.create(guild, vc, channel);
            }, index * 1000);
        }
    }
}
