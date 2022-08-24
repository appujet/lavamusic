const { EmbedBuilder, CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "removetrack",
    description: "Remove a track from your saved playlist.",
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    options: [
        {
            name: "name",
            description: "Playlist name.",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: "number",
            description: "Song number.",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name").replace(/_/g, ' ');
        const data = await db.findOne({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        if (data.length == 0) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        const Options = interaction.options.getString("number");
        if (!Options || isNaN(Options)) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You didn't enter a valid track number (ID of track to remove)\nSee all your tracks: ${prefix}info ${Name}`)] });
        }
        let tracks = data.Playlist;
        if (Number(Options) >= tracks.length || Number(Options) < 0) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Your provided track number is out of range (\`0\` - ${tracks.length - 1})\nSee all your tracks: \`${prefix}info\` showdetails ${Name}`)] });

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
            const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`Removed **${tracks[Options].title}** from \`${Name}\``);
            return interaction.editReply({embeds: [embed]});
    }
};