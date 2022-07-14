const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "247",
  aliases: ["24h", "24/7", "24*7"],
  category: "Config",
  description: "24/7 in voice channel",
  args: false,
  usage: "",
  userPerms: ['MUTE_MEMBERS'],
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
       .setDescription(`24/7 mode is now off.`)
      return message.reply({embeds: [embed]});
    }
    else {
      player.twentyFourSeven = true;
      const embed = new EmbedBuilder()
       .setColor(client.embedColor)
       .setDescription(`24/7 mode is now on.`)
      
      return message.reply({embeds: [embed]});
    }
  }
};