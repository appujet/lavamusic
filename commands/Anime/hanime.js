const { MessageEmbed, GuildEmoji } = require('discord.js');
const { HAnimeAPI } = require('hanime');
const { decode } = require('he');
const moment = require('moment');
const hanime = new HAnimeAPI();
const em = require('../../assets/json/emojis.json');
const Pages = require('../../struct/Paginate');
const text = require('../../util/string');

module.exports = {
  name: 'hanime',
  aliases: [ 'searchhentai', 'hanisearch', 'hs' ],
  cooldown: {
    time: 10000,
    message: 'You are going too fast! Please slow down to avoid getting ratelimited.',
  },
  clientPermissions: [ 'EMBED_LINKS', 'MANAGE_MESSAGES' ],
  group: 'Anime',
  nsfw: true,
  description: 'Queries hanime.tv for a specific hentai. Returns a maximum of 10 results',
  parameters: [ 'Search Query' ],
  examples: [
    'hanime saimin seishidou',
    'searchhentai mankitsu happening',
    'hanisearch dropout',
    'hs tamashii insert'
  ],
  run: async function (client, message, args){
    const { color } = client.config;
    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`\\${em.error} Please include your **hanime** query!`);
    };

    const res = await hanime.search(query);

    if (!res.hits){
      return message.channel.send(`\\${em.error} **${message.author.tag}**, no results were found for your query **${query}**!`);
    };

    const pages = new Pages(res.videos.splice(0,10).map((entry, i, a) =>
      new MessageEmbed()
      .setColor('RED')
      .setTitle(entry.name)
      .setURL(`https://hanime.tv/videos/hentai/${entry.slug}`)
      .setImage(reviseURL(entry.poster_url))
      .setThumbnail(reviseURL(entry.cover_url))
      .setAuthor('hanime.tv', 'https://i.imgur.com/fl2V0QV.png','https://hanime.tv/')
      .setDescription([
        `[**${entry.brand}**](https://hanime.tv/browse/brands/${entry.brand.toLowerCase().replace(/ +/gi, '\-')})`,
        entry.tags.sort().map(x => `[\`${x.toUpperCase()}\`](https://hanime.tv/browse/tags/${encodeURI(x)})`).join(' ')
        ].join('\n\n'))
      .setFooter([
        `Page ${i + 1} of ${a.length}`,
        `hanime.tv query | \©️${new Date().getFullYear()} ${client.config.foot}`
      ].join('\u2000\u2000•\u2000\u2000'))
      .addFields([
        { name: 'Released', value: moment(new Date(entry.released_at * 1000)).format('dddd, do MMMM YYYY'), inline: true },
        { name: 'Rank', value: text.ordinalize(entry.monthly_rank).replace('0th', 'Unranked'), inline: true },
        { name: 'Downloads', value: text.commatize(entry.downloads), inline: true },
        { name: `Likes (${Math.round((entry.likes / (entry.likes + entry.dislikes)) * 100)}%)`,
          value: text.commatize(entry.likes) , inline: true },
        { name: 'Interests', value: text.commatize(entry.interests), inline: true },
        { name: 'Views', value: text.commatize(entry.views), inline: true },
        {
          name: '\u200b',
          value: [
            text.truncate(decode(entry.description).replace(/\<\/?(p|br)\>/gi,''), 500),
            `[**\\▶ Watch** \`${entry.is_censored ? 'CENSORED' : 'UNCENSORED' }\` on **hanime.tv**](https://hanime.tv/videos/hentai/${entry.slug})`
          ].join('\n\n')
        }
      ])
    ));

    msg = await message.channel.send(pages.firstPage);

    if (pages.size === 1){
      return;
    };

    const prev = client.emojis.cache.get('767062237722050561') || '◀';
    const next = client.emojis.cache.get('767062244034084865') || '▶';
    const terminate = client.emojis.cache.get('767062250279927818') || '❌';

    const filter = (_, user) => user.id === message.author.id;
    const collector = msg.createReactionCollector(filter);
    const navigators = [ prev, next, terminate ];
    let timeout = setTimeout(()=> collector.stop(), 90000);

    for (let i = 0; i < navigators.length; i++) {
      await msg.react(navigators[i]);
    };

    collector.on('collect', async reaction => {

      switch(reaction.emoji.name){
        case prev instanceof GuildEmoji ? prev.name : prev:
          msg.edit(pages.previous());
        break;
        case next instanceof GuildEmoji ? next.name : next:
          msg.edit(pages.next());
        break;
        case terminate instanceof GuildEmoji ? terminate.name : terminate:
          collector.stop();
        break;
      };

      await reaction.users.remove(message.author.id);
      timeout.refresh();
    });

  collector.on('end', async () => await msg.reactions.removeAll());

  }
};

function reviseURL(url){
  const baseurl = 'https://i1.wp.com/static-assets.droidbuzz.top/';
  const ext = String(url).match(/images\/(covers|posters)\/[\-\w]{1,}\.(jpe?g|png|gif)/i);
  return ext ? baseurl + ext[0] : null;
};;
