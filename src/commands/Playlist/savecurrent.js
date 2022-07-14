const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "savecurrent",
    aliases: ["plsavec"],
    category: "Playlist",
    description: "Add current playing song in your saved playlist.",
    args: true,
    usage: "<playlist name>",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        const player = client.manager.players.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return message.reply({ embeds: [thing] });
        }
        if (!data) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        const track = player.queue.current;
        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        oldSong.push({
            "title": track.title,
            "uri": track.uri,
            "author": track.author,
            "duration": track.duration
        });
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $push: {
                    Playlist: {
                        title: track.title,
                        uri: track.uri,
                        author: track.author,
                        duration: track.duration
                    }

                }
            });
        const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`Added [${track.title.substr(0, 256)}](${track.uri}) in \`${Name}\``)
        return message.channel.send({ embeds: [embed] })

    }
}
