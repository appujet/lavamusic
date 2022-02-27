const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.savecurrent.name"),
    aliases: i18n.__("cmd.playlist.savecurrent.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.savecurrent.des"),
    args: true,
    usage: i18n.__("cmd.playlist.savecurrent.use"),
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const Name = args[0];
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        const player = client.manager.players.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return message.reply({ embeds: [thing] });
        }
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.savecurrent.noname", { name: Name }))] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.savecurrent.noname", { name: Name }))] });
        }
        const song = player.queue.current;
        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        oldSong.push({
            "title": song.title,
            "uri": song.uri,
            "author": song.author,
            "duration": song.duration
        });
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $push: {
                    Playlist: {
                    title: song.title,
                    uri: song.uri,
                    author: song.author,
                    duration: song.duration
                        }

                }
            });
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__mf("cmd.playlist.savecurrent.mainembed", { track: song.title.substr(0, 256), uri: song.uri, name: Name }))
        return message.channel.send({ embeds: [embed] })

    }
}
