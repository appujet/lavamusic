const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "247",
  aliases: ["24h", "24/7", "24*7"],
  category: "Config",
  description: "Sets 24/7 mode, bot stays in voice channel 24/7.",
  args: false,
  usage: "",
  userPerms: ["ManageChannels"],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    
    const player = message.client.manager.players.get(message.guild.id);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`24/7 mode is now **disabled**.`);
      return message.reply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`24/7 mode is now **enabled**.`);

      return message.reply({ embeds: [embed] });
    }
  },
};
