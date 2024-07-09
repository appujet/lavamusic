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
                    await this.client.queue.create(guild, vc, channel);
                }
            }, index * 1000);
        });

        BotLog.send(this.client, `Node ${node} is ready!`, "success");
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
