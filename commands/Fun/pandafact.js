const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'pandafacts',
  aliases: [ 'pandafact', 'pf' ],
  group: 'Fun',
  description: 'Generate a random useless pandaa facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'pandafacts',
    'pandafact',
    'pf'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch('https://some-random-api.ml/facts/panda')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Pandafact API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/QUF4VQX.gif')
      .setColor(color)
      .setDescription(data.fact)
      .setFooter(`Pandafact | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
