const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ping',
  aliases: [ 'latency' ],
  group: 'Info',
  description: 'Display various pings this bot is connected to.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'ping',
    'latency'
  ],
  run: async (client, message) => {
   const { color } = client.config;
   const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`Ping : **${client.ws.ping}**ms`)
            .setFooter(`Ping | \©️${new Date().getFullYear()} ${client.config.foot}`);
        message.channel.send(embed);
    }
}