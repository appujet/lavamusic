const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'birdfacts',
  aliases: [ 'birdfact', 'tori', 'bird' ],
  group: 'Fun',
  description: 'Generate a random useless bird facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'birdfacts',
    'birdfact',
    'tori',
    'bird'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch('https://some-random-api.ml/facts/bird')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Birdfact API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/arkxS3f.gif')
      .setColor(color)
      .setDescription(data.fact)
      .setFooter(`Birdfact | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
