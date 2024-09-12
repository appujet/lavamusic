import { Event, type Lavamusic } from "../../structures/index.js";

export default class ChannelDelete extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "channelDelete",
        });
    }

    public async run(channel: any): Promise<void> {
        const { guild } = channel;
        const setup = await this.client.db.getSetup(guild.id);
        const stay = await this.client.db.get_247(guild.id);

        if (Array.isArray(stay)) {
            for (const s of stay) {
                if (channel.type === 2 && s.voiceId === channel.id) {
                    await this.client.db.delete_247(guild.id);
                    break;
                }
            }
        } else if (stay) {
            if (channel.type === 2 && stay.voiceId === channel.id) {
                await this.client.db.delete_247(guild.id);
            }
        }

        if (setup && channel.type === 0 && setup.textId === channel.id) {
            await this.client.db.deleteSetup(guild.id);
        }

        const queue = this.client.queue.get(guild.id);
        if (queue) {
            if (
                queue.channelId === channel.id ||
                (queue.player && queue.node.manager.connections.get(guild.id)!.channelId === channel.id)
            ) {
                queue.stop();
            }
        }
    }
}
