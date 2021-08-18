const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  aliases: [ 'humorme' ],
  group: 'Fun',
  description: 'Generate a random meme from a select subreddit.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'meme',
    'humorme'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch(`https://meme-api.herokuapp.com/gimme`)
    .then(res => res.json())
    .catch(()=>null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Meme API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setImage(data.url)
      .setAuthor(data.title, null, data.postLink)
      .setFooter(`${data.subreddit}:Meme | \©️${new Date().getFullYear()}${client.config.foot}a`)
    );
  }
};
