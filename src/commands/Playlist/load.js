const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");

module.exports = {
    name: i18n.__("cmd.playlist.load.name"),
    aliases: i18n.__("cmd.playlist.load.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.load.des"),
    args: true,
    usage: i18n.__("cmd.playlist.load.use"),
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const Name = args[0];
        const player = message.client.manager.create({
            guild: message.guildId,
            voiceChannel: message.member.voice.channelId,
            textChannel: message.channelId,
            volume: 100,
            selfDeafen: true,
        });
        if (player && player.state !== "CONNECTED") player.connect();

        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name })
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.load.nodata"))] })
        }
        if (!player) return;
        let count = 0;
        const m = await message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.load.loading", {length: data.Playlist.length, name: Name}))] })
        for (const track of data.Playlist) {
            let s = await player.search(track.uri ? track.uri : track.title, message.author);
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