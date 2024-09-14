import { Event, type Lavamusic } from "../../structures/index.js";

export default class Raw extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "raw",
        });
    }

    public async run(d): Promise<void> {
        this.client.manager.sendRawData(d);
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
