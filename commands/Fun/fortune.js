const { MessageEmbed } = require('discord.js');
const fortunes = require('../../assets/json/fortune.json');

module.exports = {
  name: 'fortune',
  aliases: [ 'ft', 'fortunecookies', 'fortunecookie' ],
  group: 'Fun',
  description: 'Generate a random fortune',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'fortune',
    'ft',
    'fortunecookies',
    'fortunecookie'
  ],
  run: (client, message) => 
 
  message.channel.send(
    new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(message.author.tag)
    .setFooter(`Fortune | \©️${new Date().getFullYear()} ${client.config.foot}`)
    .setDescription(fortunes[Math.floor(Math.random() * fortunes.length)])
  )
};
