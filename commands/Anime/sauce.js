require('moment-duration-format');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { API } = require('nhentai-api');
const api = new API();

module.exports = {
  name: 'sauce',
  aliases: [ 'gimmesauce', 'finddoujin', 'doujin', 'nhentai', 'saucefor' ],
  guildOnly: true,
  cooldown: {
    time: 30000
    , message: 'You are going too fast! Please slow down to avoid being rate-limited!'
  },
  nsfw: true,
  group: 'Anime',
  description: 'Fetch doujin information from <:nhentai:767062351169323039> [nHentai](https://nhentai.net "nHentai Homepage")',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [ 'Media ID' ],
  examples: [
    'sauce 263492',
    'gimmesauce 166258',
    'finddoujin 177013',
    'doujin 245212',
    'nhentai 337864',
    'saucefor 337879'
  ],
  run: async function run( client, message, [id] ){

    if (isNaN(id)) {
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`${em.error} | ${message.author}, Please provide a valid **Sauce**.`);
    };
    const { color } = client.config;
    const prompt = new MessageEmbed()
    .setColor('YELLOW')
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setDescription(`Searching for **${id}** on <:nhentai:767062351169323039> [nHentai.net](https:/nhentai.net 'nHentai Homepage').`)
    .setFooter(`Doujin Query | \©️${new Date().getFullYear()} ${client.config.foot}`);

    const msg = await message.channel.send(prompt);
    const book = await api.getBook(id).catch(()=>null);

    if (!book){
      prompt.setColor('RED')
      .setAuthor('None Found','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(`**${message.member.displayName}**, couldn't find doujin with sauce **${id}**.`)
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')

      return await msg.edit(prompt).catch(()=>null) || message.channel.send(prompt);
    };

    const { title: { english, japanese, pretty },
            tags, pages, uploaded, cover } = book

    const embed = new MessageEmbed()
    .setColor(color)
    .setFooter(`Doujin Query | \©️${new Date().getFullYear()} ${client.config.foot}`)
    .setAuthor(pretty, null, `https://nhentai.net/g/${id}`)
    .setDescription(`**${book.title.english}**\n*${book.title.japanese}*`)
    .setThumbnail(api.getImageURL(cover))
    .addFields([
      { name: 'TAGS', value: book.tags.map( m => m.name).sort().join(', ')},
      { name: 'PAGES', value: book.pages.length, inline: true },
      {
        name: 'Uploaded on',
        value: [
          moment(book.uploaded).format('dddd Do MMMM YYYY'), '\n',
          moment.duration(Date.now() - book.uploaded).format('Y [Years] M [Months, and] D [Days]'),
          ' ago.'
        ].join(''),
        inline: true
      },{
        name: '\u200b',
        value: [
          `[\`[LINK]\`](https://nhentai.net/g/${id} `,
          `'Click here to proceed to ${book.title.pretty}\'s nHentai Page')`
        ].join(''),
        inline: true
      }
    ]);

    return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
  }
}
