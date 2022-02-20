const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.removetrack.name"),
    description: i18n.__("cmd.playlist.removetrack.des"),
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    options: [
        {
            name: i18n.__("cmd.playlist.slash.name"),
            description: i18n.__("cmd.playlist.slash.des"),
            required: true,
            type: "STRING"
        },
        {
            name: i18n.__("cmd.playlist.slash.name2"),
            description: i18n.__("cmd.playlist.slash.des2"),
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
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.noname", { name: Name }))] });
        }
        if (data.length == 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.delete.noname", { name: Name }))] });
        }
        const Options = interaction.options.getString("number");
        if (!Options || isNaN(Options)) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.nonumber", { prefix: prefix, name: Name }))] });
        }
        let tracks = data.Playlist;
        if (Number(Options) >= tracks.length || Number(Options) < 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.removetrack.wrongumber", { tracks: tracks.length - 1, prefix: prefix, name: Name }))] });

        }
        await db.updateOne({
            UserId: interaction.user.id,
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
            return interaction.editReply({embeds: [embed]});
    }
};