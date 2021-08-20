const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldState, newState) => {
    const newVoice = newState.channelID
    const oldVoice = oldState.channelID
    
    const emojiLeave = client.emoji.leave;
    const thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(`${emojiLeave} **Leave the voice channel**\nThank you for using ${client.user.username}!`)
        .setFooter(client.user.username, client.user.displayAvatarURL());

    if (oldVoice != newVoice) {
        if (oldVoice == null) { 
          
        } else if (newVoice == null) { 
          // User leaves a voice channel
            
            const player = client.manager.get(oldState.guild.id);
            if (!player) return;

            const channel = client.channels.cache.get(player.textChannel);
            
            if (oldState.id === client.user.id) {
                return player.destroy();
            }
            if (oldVoice === player.voiceChannel) {
                if (oldState.channel.members.filter(m => !m.user.bot).size >= 1) return;
                channel.send(thing);
                return player.destroy();
            }

		} else { // User Move from voice channel
            
            const player = client.manager.get(oldState.guild.id);
            if (!player) return;

            const channel = client.channels.cache.get(player.textChannel);
            
            if (oldState.id === client.user.id) {
                return player.destroy();
            }
            if (oldVoice === player.voiceChannel) {
                if (oldState.channel.members.filter(m => !m.user.bot).size >= 1) return;
                channel.send(thing);
                return player.destroy();
            }

		  }

	 }
    
};