import type { DestroyReasonsType, LavalinkNode } from "lavalink-client";
import { Event, type Lavamusic } from "../../structures/index";
import BotLog from "../../utils/BotLog";

export default class Destroy extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "destroy",
        });
    }

    public async run(node: LavalinkNode, destroyReason?: DestroyReasonsType): Promise<void> {
        this.client.logger.success(`Node ${node.id} is destroyed!`);
        BotLog.send(this.client, `Node ${node} is destroyed: ${destroyReason}`, "warn");
    }
}
