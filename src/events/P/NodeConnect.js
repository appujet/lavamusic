import Event from "../../structures/Event.js";

export default class NodeConnect extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    /**
     * 
     * @param {import('shoukaku').Node} node 
     */
    async run(node) {
        this.client.logger.ready(`Node ${node.name} connected`);
    }
};