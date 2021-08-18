const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'dogfacts',
  aliases: [ 'dogfact', 'inu', 'df' ],
  group: 'Fun',
  description: 'Generate a random useless dog facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'dogfacts',
    'dogfact',
    'inu',
    'df'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch('https://dog-api.kinduff.com/api/facts')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Dogfact API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/oTVVqHQ.gif')
      .setColor(color)
      .setDescription(data.facts)
      .setFooter(`Dogfact | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
