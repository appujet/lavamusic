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
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {

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

        const newData = new db({
            UserName: message.author.tag,
            UserId: message.author.id,
            PlaylistName: Name,
            CreatedOn: Math.round(Date.now() / 1000)
        });
        await newData.save();
        const embed = new MessageEmbed()
            .setDescription(i18n.__mf("cmd.playlist.create.mainembed", { name: Name }))
            .setColor(client.embedColor)
        return message.channel.send({ embeds: [embed] })

    }
};