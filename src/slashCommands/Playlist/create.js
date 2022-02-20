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

        const player = client.manager.players.get(interaction.guildId);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return interaction.editReply({ embeds: [thing] });
        }
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
    const newData = new db({
        UserName: interaction.user.tag,
        UserId: interaction.user.id,
        PlaylistName: Name,
        Playlist: playlist,
        CreatedOn: Math.round(Date.now() / 1000)
    });
    await newData.save();
    const embed = new MessageEmbed()
        .setDescription(i18n.__mf("cmd.playlist.create.mainembed", { name: Name }))
        .setColor(client.embedColor)
    return interaction.editReply({ embeds: [embed] })

}
};
