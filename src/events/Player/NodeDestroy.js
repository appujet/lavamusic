import Event from "../../structures/Event.js";

export default class NodeDestroy extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    async run(node, code, reason) {
        this.client.logger.warn(`Node ${node.name} destroyed with code ${code} and reason ${reason}`);
    }
}