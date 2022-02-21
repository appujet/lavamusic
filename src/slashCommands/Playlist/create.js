const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.create.name"),
    description: i18n.__("cmd.playlist.create.des"),
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: i18n.__("cmd.playlist.slash.name"),
            description: i18n.__("cmd.playlist.slash.des"),
            required: true,
            type: "STRING"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name");
        const data = await db.find({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (Name.length > 10) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.create.argsembed"))] });

        };
        if (data.length > 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.create.dataembed", { prefix: prefix, name: Name }))] })
        };
        let userData = db.find({
            UserId: interaction.user.id
        });
        if (userData.length >= 10) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.create.existembed"))] })
        }
        const newData = new db({
            UserName: interaction.user.tag,
            UserId: interaction.user.id,
            PlaylistName: Name,
            CreatedOn: Math.round(Date.now() / 1000)
        });
        await newData.save();
        const embed = new MessageEmbed()
            .setDescription(i18n.__mf("cmd.playlist.create.mainembed", { name: Name }))
            .setColor(client.embedColor)
        return interaction.editReply({ embeds: [embed] })

    }
};
