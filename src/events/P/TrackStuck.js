import Event from "../../structures/Event.js";

export default class TrackStuck extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    async run(player, track, threshold) {
        this.client.logger.warn(`Track ${track.track} stucked in guild: ${player.connection.guildId}`);
    }
}