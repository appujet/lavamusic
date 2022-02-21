const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");
const i18n = require("../../utils/i18n");

module.exports = {
    name: i18n.__("cmd.playlist.removetrack.name"),
    aliases: i18n.__("cmd.playlist.removetrack.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.removetrack.des"),
    args: true,
    usage: i18n.__("cmd.playlist.removetrack.use"),
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {

        const Name = args[0];
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.noname", { name: Name }))] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }
        const Options = args[1];
        if (!Options || isNaN(Options)) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.nonumber", { prefix: prefix, name: Name }))] });
        }
        let tracks = data.Playlist;
        if (Number(Options) >= tracks.length || Number(Options) < 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.wrongumber", { tracks: tracks.length - 1, prefix: prefix, name: Name }))] });

        }
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $pull: {
                    Playlist: data.Playlist[Options]
                }
            });
            const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__mf("cmd.playlist.removetrack.mainembed", { tracks: tracks[Options].title, name: Name }));
            return message.channel.send({embeds: [embed]});
    }
};