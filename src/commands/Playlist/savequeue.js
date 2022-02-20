const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.save.name"),
    aliases: i18n.__("cmd.playlist.save.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.save.des"),
    args: true,
    usage: i18n.__("cmd.playlist.save.use"),
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const Name = args[0];
        const player = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return message.reply({ embeds: [thing] });
        }
        const data = await db.find({ UserId: message.author.id, PlaylistName: Name })
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.save.nodata"))] })
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.save.noname", { name: Name }))] });
        }
        const song = player.queue.current;
        const tracks = player.queue;

        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        const newSong = [];
        if (player.queue.current) {
            newSong.push({
                "title": song.title,
                "uri": song.uri,
                "author": song.author,
                "duration": song.duration
            });
        }
        for (const track of tracks)
            newSong.push({
                "title": track.title,
                "uri": track.uri,
                "author": track.author,
                "duration": track.duration
            });
        const playlist = oldSong.concat(newSong);
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name,
        },
            {
                $set: {
                    Playlist: playlist
                }

            });
        const embed = new MessageEmbed()
            .setDescription(i18n.__mf("cmd.playlist.save.mainembed", { save: playlist.length - oldSong.length, name: Name }))
            .setColor(client.embedColor)
        return message.channel.send({ embeds: [embed] })

    }
}