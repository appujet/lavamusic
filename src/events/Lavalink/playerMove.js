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
        if(channel) await  channel.send({ embeds: [new MessageEmbed().setColor(message.client.embedColor).setDescription(`<:voice:935490659681447937> Disconnected from <#${oldChannel}>`)]})
         return player.destroy();
      } else {
        player.voiceChannel = newChannel;
        
        if(channel) await channel.send({embeds: [new MessageEmbed().setColor(message.client.embedColor).setDescription(`<:voice:935490659681447937> Player moved to <#${player.voiceChannel}>`)]});
        if(player.paused) player.pause(false);
      }

}
