const { MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");
    /**
     * 
     * @param {Player} player 
     * @param {String} oldChannel
     * @param {String} newChannel
     */
module.exports = async (client, player, oldChannel, newChannel) => {
      const guild = client.guilds.cache.get(player.guild)
      if(!guild) return;
      const channel = guild.channels.cache.get(player.textChannel);
        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;
        if(channel) await  channel.send({ embeds: [new MessageEmbed().setDescription(`I've been disconnected from <#${oldChannel}>`)]})
         return player.destroy();
      } else {
        player.voiceChannel = newChannel;
        
        if(channel) await channel.send({embeds: [new MessageEmbed().setDescription(`Player voice channel moved to <#${player.voiceChannel}>`)]});
        if(player.paused) player.pause(false);
      }

}
