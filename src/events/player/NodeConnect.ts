import { Event, type Lavamusic } from "../../structures/index.js";
import BotLog from "../../utils/BotLog.js";

export default class NodeConnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "nodeConnect",
        });
    }

    public async run(node: string): Promise<void> {
        this.client.logger.success(`Node ${node} is ready!`);

        let data = await this.client.db.get_247();
        if (!data) return;

        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach((main, index) => {
            setTimeout(async () => {
                const guild = this.client.guilds.cache.get(main.guildId);
                if (!guild) return;

                const channel = guild.channels.cache.get(main.textId);
                const vc = guild.channels.cache.get(main.voiceId);

                if (channel && vc) {
                    try {
                        await this.client.queue.create(guild, vc, channel);
                    } catch (error) {
                        this.client.logger.error(`Failed to create queue for guild ${guild.id}: ${error.message}`);
                    }
                } else {
                    this.client.logger.warn(
                        `Missing channels for guild ${guild.id}. Text channel: ${main.textId}, Voice channel: ${main.voiceId}`,
                    );
                }
            }, index * 1000);
        });

        BotLog.send(this.client, `Node ${node} is ready!`, "success");
    }
}
