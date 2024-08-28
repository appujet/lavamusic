import { Event, type Lavamusic } from "../../structures/index.js";
import BotLog from "../../utils/BotLog.js";

export default class NodeError extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "nodeError",
        });
    }

    public async run(node: string, error: any): Promise<void> {
        const errorMessage = JSON.stringify(error, null, 2);
        const message = `Node ${node} Error: ${errorMessage}`;
        this.client.logger.error(message);
        BotLog.send(this.client, message, "error");
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
