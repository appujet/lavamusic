const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const i18n = require("../../utils/i18n.js");

module.exports = {
    name: i18n.__("cmd.lyrics.name"),
    aliases: i18n.__("cmd.lyrics.aliases"),
    category: "Music",
    description: i18n.__("cmd.lyrics.des"),
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);
    
    const queue = player.queue.current;
    if (!queue) return message.channel.send(i18n.__("lyrics.errorNotQueue")).catch(console.error);

    let lyrics = null;
    const title = queue.title;
    try {
      lyrics = await lyricsFinder(queue.title, "");
      if (!lyrics) lyrics = ("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
      lyrics = ("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`${player.queue.current.title}`, { title: title })
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send({embeds: [lyricsEmbed]}).catch(console.error);
  }
};
