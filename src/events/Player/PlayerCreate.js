import Event from "../../structures/Event.js"; import Dispatcher from "../../structures/Dispatcher.js";


export default class PlayerCreate extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    /**
     * 
     * @param {import('shoukaku').Player} player
     */
    async run(player) {
        this.client.logger.info(`Player has been created in guild: ${player.connection.guildId}`);
    }
}