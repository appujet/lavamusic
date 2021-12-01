const { MessageEmbed, Client} = require("discord.js");
/**
 * 
 * @param {Client} client
 * @param {String} oldChannel
 * @param {String} newChannel
 */
module.exports = async (client, player, oldChannel, newChannel) => {
      const guild = client.guild.cache.get(player.guild)
      if(!guild) return;
      const channel = guild.channels.cache.get(player.textChannel);
       if (!newChannel) {
        await player.destroy();
        return channel.send({ embeds: [new MessageEmbed()].setDescription("Music stopped as I have been disconnected from the voice channel.")})
      } else {
        player.voiceChannel = newChannel;
     }
}
