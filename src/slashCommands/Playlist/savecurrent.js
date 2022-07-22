const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "savecurrent",
    description: "Add current playing song in your saved playlist.",
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "name",
            description: "Playlist Name",
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

        const player = client.manager.players.get(interaction.guildId);
        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Nothing is playing right now.')
            return interaction.editReply({ embeds: [thing] });
        }
        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        if (data.length == 0) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        const track = player.queue.current;
        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        oldSong.push({
            "title": track.title,
            "uri": track.uri,
            "author": track.author,
            "duration": track.duration
        });
        await db.updateOne({
            UserId: interaction.user.id,
            PlaylistName: Name
        },
            {
                $push: {
                    Playlist: {
                        title: track.title,
                        uri: track.uri,
                        author: track.author,
                        duration: track.duration
                    }

                }
            });
        const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`Added [${track.title.substr(0, 256)}](${track.uri}) in \`${Name}\``)
        return interaction.editReply({ embeds: [embed] })

    }
}
