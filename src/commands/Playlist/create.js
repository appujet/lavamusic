const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.create.name"),
    aliases: i18n.__("cmd.playlist.create.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.create.des"),
    args: true,
    usage: i18n.__("cmd.playlist.create.use"),
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return message.reply({ embeds: [thing] });
        }
        const Name = args[0];
        if (Name.length > 10) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.create.argsembed"))] });

        };
        let data = await db.find({
            UserId: message.author.id,
            PlaylistName: Name,
        });

        if (data.length > 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.create.dataembed", { prefix: prefix, name: Name }))] })
        };
        let userData = db.find({
            UserId: message.author.id
        });
        if (userData.length >= 10) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.create.existembed"))] })
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
        const newData = new db({
            UserName: message.author.tag,
            UserId: message.author.id,
            PlaylistName: Name,
            Playlist: playlist,
            CreatedOn: Math.round(Date.now() / 1000)
        });
        await newData.save();
        const embed = new MessageEmbed()
            .setDescription(i18n.__mf("cmd.playlist.create.mainembed", { name: Name }))
            .setColor(client.embedColor)
        return message.channel.send({ embeds: [embed] })

    }
};