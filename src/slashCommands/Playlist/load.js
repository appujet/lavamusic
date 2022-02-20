const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.load.name"),
    description: i18n.__("cmd.playlist.load.des"),
    player: false,
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

        const player = interaction.client.manager.create({
            guild: interaction.guildId,
            voiceChannel: interaction.member.voice.channelId,
            textChannel: interaction.channelId,
            volume: 100,
            selfDeafen: true,
        });

        if (player && player.state !== "CONNECTED") player.connect();

        if (!data) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.load.nodata"))] })
        }
        if (!player) return;

        let count = 0;
        const m = await interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.load.loading", {length: data.Playlist.length, name: Name}))] })
        for (const track of data.Playlist) {
            let s = await player.search(track.uri ? track.uri : track.title, interaction.member);
            if (s.loadType === "TRACK_LOADED") {
                if (player.state !== "CONNECTED") player.connect();
                if (player) player.queue.add(s.tracks[0]);
                if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                ++count;
            } else if (s.loadType === "SEARCH_RESULT") {
                if (player.state !== "CONNECTED") player.connect();
                if (player) player.queue.add(s.tracks[0]);
                if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                ++count;
            };
        };
        if (player && !player.queue.current) player.destroy();
        if (count <= 0 && m) return await m.edit({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.load.errorembed", {name: Name}))] })
        if (m) return await m.edit({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.load.mainembed", {name: Name}))] })
    }

};

