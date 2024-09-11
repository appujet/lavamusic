import { Event, type Lavamusic } from "../../structures/index.js";

export default class NodeRaw extends Event {
  constructor(client: Lavamusic, file: string) {
    super(client, file, {
      name: "nodeRaw",
    });
  }

  public async run(_payload: any): Promise<void> {
    // Uncomment the following line for debugging purposes
    // this.client.logger.debug(`Node raw event: ${JSON.stringify(payload)}`);
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
