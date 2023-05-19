import { Event, Lavamusic } from '../../structures/index.js';
import { Node } from 'shoukaku';

export default class NodeConnect extends Event {
  constructor(client: Lavamusic, file: string) {
    super(client, file, {
      name: 'nodeConnect',
    });
  }
  public async run(node: Node): Promise<void> {
    this.client.logger.success(`Node ${node.name} is ready!`);
    const data = await this.client.prisma.stay.findMany();

    for (const main of data) {
      const index = data.indexOf(main);
      setTimeout(async () => {
        const guild = await this.client.guilds.fetch(main.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(main.textId);
        if (!channel) return;
        const vc = guild.channels.cache.get(main.voiceId);
        if (!vc) return;
        await this.client.queue.create(guild, vc, channel);
        this.client.logger.success(`Created player queue for ${guild.name} (${guild.id})`);
      }, index * 1000);
    }
  }
}
