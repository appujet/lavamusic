import { Event, type Lavamusic } from "../../structures/index.js";
import BotLog from "../../utils/BotLog.js";

export default class NodeDisconnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "nodeDisconnect",
        });
    }

    public async run(node: string, count: number): Promise<void> {
        const message = `Node ${node} disconnected ${count} times`;
        this.client.logger.warn(message);
        BotLog.send(this.client, message, "warn");
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
