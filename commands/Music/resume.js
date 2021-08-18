const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'resume',
  aliases: [""],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  inVoiceChannel: true,
  sameVoiceChannel: true,
  group: 'Music',
  description: 'Resume currently playing music',
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

        message.client.distube.resume(message)

      
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`**Resumed** the song!`)
            .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
        message.channel.send(embed);
    }
}