const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.savecurrent.name"),
    description: i18n.__("cmd.playlist.savecurrent.des"),
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

    run: async (client, interaction) => {

        
        await interaction.deferReply({});

        const Name = interaction.options.getString("name");
        const data = await db.findOne({ UserId: interaction.member.user.id, PlaylistName: Name });

        const player = client.manager.players.get(interaction.guildId);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return interaction.editReply({ embeds: [thing] });
        }
        if (!data) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.savecurrent.noname", { name: Name }))] });
        }
        if (data.length == 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.savecurrent.noname", { name: Name }))] });
        }
        const song = player.queue.current;
        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        oldSong.push({
            "title": song.title,
            "uri": song.uri,
            "author": song.author,
            "duration": song.duration
        });
        await db.updateOne({
            UserId: interaction.user.id,
            PlaylistName: Name
        },
            {
                $push: {
                    Playlist: {
                    title: song.title,
                    uri: song.uri,
                    author: song.author,
                    duration: song.duration
                        }

                }
            });
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__mf("cmd.playlist.savecurrent.mainembed", { track: song.title.substr(0, 256), uri: song.uri, name: Name }))
        return interaction.editReply({ embeds: [embed] })

    }
}
