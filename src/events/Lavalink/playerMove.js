const { MessageEmbed } = require("discord.js");

module.exports = async (client, player, oldChannel, newChannel) => {
      if (!newChannel) {
        await player.destroy();
        return message.channel.send({ embeds: [new MessageEmbed()].setDescription("Music stopped as I have been disconnected from the voice channel.")})
      } else {
        player.voiceChannel = newChannel;
      }
			}