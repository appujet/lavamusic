import Ptefix from "../schemas/prefix.js";
import { BotClient } from "../structures/Client.js";
/**
 * @param {string} guildId
 * @param {BotClient} client
 */
async function getPrefix(guildId, client) {
    let prefix;
    const data = await Ptefix.findOne({ _id: guildId });
    if (data && data.prefix) {
        prefix = data.prefix;
    } else {
        prefix = client.config.prefix;
    }
    return prefix;
}
export {
    getPrefix,
}