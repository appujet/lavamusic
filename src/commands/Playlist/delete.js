const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");
const i18n = require("../../utils/i18n");

module.exports = {
    name: i18n.__("cmd.playlist.delete.name"),
    aliases: i18n.__("cmd.playlist.delete.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.delete.des"),
    args: true,
    usage: i18n.__("cmd.playlist.delete.use"),
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {

        const Name = args[0];
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }
        await data.delete();
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__mf("cmd.playlist.delete.mainembed", { name: Name }))
        return message.channel.send({ embeds: [embed] })
    }
}