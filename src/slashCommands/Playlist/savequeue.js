const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "savequeue",
    description: "Save the current queue to your playlist.",
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "name",
            description: "Playlist name.",
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
                .setDescription(`There is no music playing.`);
            return interaction.editReply({ embeds: [thing] });
        }

        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Playlist not found. Please enter the correct playlist name.`)] })
        }
        if (data.length == 0) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Playlist not found. Please enter the correct playlist name.`)] });
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
            UserId: interaction.user.id,
            PlaylistName: Name,
        },
            {
                $set: {
                    Playlist: playlist
                }

            });
        const embed = new EmbedBuilder()
            .setDescription(`**Added** \`${playlist.length - oldSong.length}\`song(s) in \`${Name}\``)
            .setColor(client.embedColor)
        return interaction.editReply({ embeds: [embed] })

    }
}

