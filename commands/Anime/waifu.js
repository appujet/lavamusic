const { MessageEmbed } = require('discord.js');
const waifuDB = require('../../assets/json/waifulist.json');
const text = require('../../util/string.js');

module.exports = {
  name: 'waifu',
  aliases: [],
  group: 'Anime',
  description: 'Generates random waifu.',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY' ],
  parameters: [],
  examples: [
    'waifu'
  ],
  run: (client, message) => {

//---------------------------------WORK IN PROGRESS-----------------------------------//
    if (!message.channel.nsfw){
      return message.channel.send(`This command is still work on progress. Images can be NSFW at times, to view how this command works, go to a NSFW channel.`)
    };
//--------------------------------WORK IN PROGRESS------------------------------------//
    const { color } = client.config;
    const waifu = waifuDB[Math.floor(Math.random() * (waifuDB.length))];
    const no = Math.floor(Math.random() * waifu.images.length);

    message.channel.startTyping();

    const embed = new MessageEmbed()
    .setColor(color)
    .setAuthor(text.truncate([ waifu.names.en, waifu.names.jp, waifu.names.alt ].filter(Boolean).join('\n'), 200), waifu.avatar || null)
    .setDescription([ waifu.from.name, waifu.from.type].filter(Boolean).map(x => `*${x}*`).join('\n'))
    .setImage(waifu.images[no])
    .setFooter([
      `❣️${(100 * (((1 - waifu.statistics.hate / (waifu.statistics.love + waifu.statistics.fav)) * 0.6) + ((waifu.statistics.upvote / (waifu.statistics.upvote + waifu.statistics.downvote)) * 0.4))).toFixed(2)}`,
      `${ no + 1 } of ${ waifu.images.length }`,
      `\©️${new Date().getFullYear()}${client.config.foot}`
    ].join('\u2000|\u2000'));

    return message.channel.send(embed).then( m => m.react('💖')).then(() => message.channel.stopTyping())

  }
};
