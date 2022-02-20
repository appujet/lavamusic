const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const db = require("../../schema/playlist");
const i18n = require("../../utils/i18n");

module.exports = {
    name: i18n.__("cmd.playlist.delete.name"),
    description: i18n.__("cmd.playlist.delete.des"),
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
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

    run: async (client, interaction) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name");
        const data = await db.findOne({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (!data) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }

        if (data.length == 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }

        await data.delete();
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__mf("cmd.playlist.delete.mainembed", { name: Name }))
        return interaction.editReply({ embeds: [embed] })
    }
}
