const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'joke',
  aliases: [ 'haha' ],
  group: 'Fun',
  description: 'Generate a random joke from a joke API',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'joke',
    'haha'
  ],
  run: async (client, message) => {
    const { color } = client.config;
    const data = await fetch('https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Joke API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setAuthor(`${data.category} Joke`)
      .setThumbnail('https://i.imgur.com/KOZUjcc.gif')
      .setFooter(`Joke | \©️${new Date().getFullYear()} ${client.config.foot}`)
      .setDescription(data.type === 'twopart' ? `${data.setup}\n\n||${data.delivery}||` : data.joke)
    );
  }
};
