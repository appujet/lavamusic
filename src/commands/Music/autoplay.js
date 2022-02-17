const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.autoplay.name"),
  aliases: i18n.__("cmd.autoplay.aliases"),
  category: "Music",
  description: i18n.__("cmd.autoplay.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    const autoplay = player.get("autoplay");

    const emojireplay = client.emoji.autoplay;

    if (autoplay === false) {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", message.author);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      res = await player.search(search, message.author);
      player.queue.add(res.tracks[1]);
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} ${i18n.__("cmd.autoplay.on")}`);
      return message.channel.send({ embeds: [thing] });
    } else {
      player.set("autoplay", false);
      player.queue.clear();
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} ${i18n.__("cmd.autoplay.on")}`);

      return message.channel.send({ embeds: [thing] });
    }
  },
};
