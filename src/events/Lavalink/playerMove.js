const { MessageEmbed } = require("discord.js");

module.exports = async (client, player, oldChannel, newChannel) => {
      const channel = guild.channels.cache.get(player.textChannel);
       if (!newChannel) {
        await player.destroy();
        return channel.send({ embeds: [new MessageEmbed()].setDescription("Music stopped as I have been disconnected from the voice channel.")})
      } else {
        player.voiceChannel = newChannel;
      }
			}
