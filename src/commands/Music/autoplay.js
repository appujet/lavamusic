const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  category: "Music",
  description: "Toggle music autoplay.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.get(message.guild.id);

    const autoplay = player.get("autoplay");

    const emojireplay = client.emoji.autoplay;

    if (!player.queue.current)
      return message.reply({
        content: `Please play a song before using this command.`,
      });
    
    const uri = player.queue.current.uri;
    if (!(uri.includes("youtube.") || uri.includes("youtu.be")))
    return message.reply({
      content: `Autoplay feature is currently **not available** for this source.\nSupported sources: \`YouTube\`, \`YouTube Music\``
    });

    if (autoplay) {
      player.set("autoplay", false);
      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **disabled**.`);
      return message.channel.send({ embeds: [thing] });
    } else {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", client.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, message.author);
      player.queue.add(
        res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]
      );
      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **enabled**.`);

      return message.channel.send({ embeds: [thing] });
    }
  },
};
