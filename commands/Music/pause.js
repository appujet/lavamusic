const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'pause',
  aliases: [""],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  inVoiceChannel: true,
  sameVoiceChannel: true,
  group: 'Music',
  description: 'Pause the current song',
  examples: [''],
  parameters: [''],
  run: async (client, message, args) => {
      
      const { color } = client.config;
      const queue = message.client.distube.getQueue(message);

        if(!queue) {
           const embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`There is no music playing.`);
            return message.channel.send(embed);
        }

        // Queue status templat
      
        if (queue.pause) {
            message.client.distube.resume(message)
            const embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`**Resumed** the song!`)
                .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
            return message.channel.send(embed);
        }

        message.client.distube.pause(message)
        
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`**Paused** the song!`)
            .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
        message.channel.send(embed);
    }
}