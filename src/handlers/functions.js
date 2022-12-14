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
function checkURL(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}
function progressBar(current, total, size = 20) {
    let line = "▬";
    let slider = "🔘";
    let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];

    if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
    return `${bar[0]}`;

}
function formatTime(ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    if (days !== "0") {
        return `${days.padStart(1, "0")}:${hrs.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    } else if (hrs !== "0") {
        return `${hrs.padStart(1, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    } else if (min !== "0") {
        return `${min.padStart(1, "0")}:${sec.padStart(2, "0")}`;
    } else {
        return `${sec.padStart(1, "0")}s`;
    }
}
export {
    getPrefix,
    checkURL,
    progressBar,
    formatTime
}