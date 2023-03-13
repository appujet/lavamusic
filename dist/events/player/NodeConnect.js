import { Event } from "../../structures/index.js";
export default class NodeConnect extends Event {
    constructor(client, file) {
        super(client, file, {
            name: "nodeConnect",
        });
    }
    async run(node) {
        this.client.logger.success(`Node ${node.name} is ready!`);
    }
}
//# sourceMappingURL=NodeConnect.js.map