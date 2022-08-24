const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clearqueue",
    aliases: ["cq", "clear"],
    category: "Music",
    description: "Removes all songs in the music queue.",
    args: false,
    usage: "",
    userPerms: [],
    dj: true,
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("RED")
                .setDescription("No songs are currently in queue.");
            return message.reply({ embeds: [thing] });
        }

        player.queue.clear();

        const emojieject = message.client.emoji.remove;

        let thing = new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojieject} Removed all songs from the queue.`)
        return message.reply({ embeds: [thing] });
    }
};