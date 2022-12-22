import Event from "../../structures/Event.js";

export default class NodeReconnect extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    /**
     * 
     * @param {import('shoukaku').Node} node 
     */
    async run(node) {
        this.client.logger.warn(`Node ${node.name} reconnected`);
    }
}