const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'advice',
  aliases: [ 'tips', 'advise' ],
  group: 'Fun',
  description: 'Generate a random useless advice',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'advice',
    'tips',
    'advise'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Advice API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setTitle(data.slip.advice)
      .setFooter(`Advice | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
