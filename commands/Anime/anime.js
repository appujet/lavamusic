const moment = require('moment');
const { getInfoFromName } = require('mal-scraper');
const { MessageEmbed } = require('discord.js');
const em = require('../../assets/json/emojis.json');
const malProducers = require('../../assets/json/MAL_Producers.json');
const { malGenres } = require('../../util/constants');
const text = require('../../util/string');

module.exports = {
  name: 'anime',
  aliases: [ 'ani', 'as', 'anisearch'],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: 'Anime',
  description: `Searches for a specific anime in [MyAnimeList](https://myanimelist.net "Homepage"), or shows Alina\'s anime series information if no query is provided.`,
  parameters: [ 'Search Query' ],
  examples: [
    'anime',
    'as seishun buta yarou',
    'ani aobuta',
    'anisearch bunnygirl senpai'
  ],
  run: async ( client, message, args ) => {
    const { color } = client.config;
    const query = args.join(' ') || 'Seishun Buta Yarou';

    // Indicate that the bot is doing something in the background
    message.channel.startTyping();

    const data = await new Promise((resolve,reject) => {
      setTimeout(() => reject('TIMEOUT'), 10000);

      return getInfoFromName(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
    }).catch((err)=> err !== 'TIMEOUT' ? null : err)

    if (!data){
      return message.channel.send([
        `\\${em.error} **${message.author.tag}**, No results were found for **${query}**`,
        'If you believe this anime exists, try the following methods:',
        '\u2000•\u2000Try the alternative names (e.g. English, Native, Romanized)',
        '\u2000•\u2000Include the season number (if applicable)',
        '\u2000•\u2000Include the type (e.g. OVA, ONA, TV Shorts).'
      ].join('\n')).then(() => message.channel.stopTyping());
    } else if (data === 'TIMEOUT'){
      return message.channel.send([
        `\\${em.error} **${message.author.tag}**, MyAnimeList took longer to respond.`,
        'Please try again later, this may be caused by a server downtime.'
      ].join('\n')).then(() => message.channel.stopTyping());
    };

    message.channel.stopTyping();

    const isHentai = data.genres.some(x => x === 'Hentai');
    const nsfwch = message.guild.channels.cache.filter(x => x.nsfw).map(x => x.toString());

    if (isHentai && message.channel.nsfw === false){
      return message.channel.send(`${em.error} | **${message.author.tag}**, you've searched for \`Hentai\` on a sfw channel!\n\nYour query, **${
        query
      }**, returned a hentai title from **${data.studios[0]}**. Please try to query hentai entries on nsfw channels${
        nsfwch.length ? ` such as ${text.joinArray(nsfwch)}` : ''
      }. While you're at it, you can query these genres from **hanime** using \`hanime\` command aswell.`)
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setURL(data.url)
      .setThumbnail(data.picture || null)
      .setFooter(`Anime Query with | \©️${new Date().getFullYear()} ${client.config.foot}`)
      .setTitle(text.truncate(data.englishTitle || data.title, 200))
      .setDescription([
        [
          `[\\⭐](https://myanimelist.net/anime/${data.id}/stats 'Score'): ${data.score}`,
          `[\\🏅](https://myanimelist.net/info.php?go=topanime 'Rank'): ${isNaN(data.ranked.slice(1)) ? 'N/A' : text.ordinalize((data.ranked).slice(1))}`,
          `[\\✨](https://myanimelist.net/info.php?go=topanime 'Popularity'): ${data.popularity || '~'}`,
          `[\` ▶ \`](${data.trailer} 'Watch Trailer')`
        ].join('\u2000\u2000•\u2000\u2000'),
        `\n${text.joinArray(data.genres.map(g =>
          `[${g}](https://myanimelist.net/anime/genre/${malGenres[g.toLowerCase()]})`
        )||[])}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      ].filter(Boolean).join('\n'))
      .addFields([
        {
          name: 'Source', inline: true,
          value: data.source ? [data.source].map(x => {
            const valid_sources = {
              'Light novel':'lightnovels',
              'Manga':'manga',
              'Web manga':'manhwa',
              'One-shot':'oneshots',
              'Doujinshi':'doujin',
              'Novel':'novels',
              'Manhwa':'manhwa',
              'Manhua':'manhua'
            };
            return x ? `[**${x}**](https://myanimelist.net/topmanga.php?type=${valid_sources[x] || 'manga'})` : x;
          }) : 'Unknown'
        },{
          name: 'Episodes', inline: true,
          value: `[**${data.episodes}**](https://myanimelist.net/anime/${data.id}/_/episode)`,
        },{
          name: 'Duration', inline: true,
          value: data.duration || 'Unknown',
        },{
          name: 'Type', inline: true,
          value: data.type ? `[**${data.type}**](https://myanimelist.net/topanime.php?type=${encodeURI(data.type.toLowerCase())})` : 'showType Unavailable'
        },{
          name: 'Premiered', inline: true,
          value: data.premiered && data.premiered !== '?' ? `[**${data.premiered}**](https://myanimelist.net/anime/season/${data.premiered.split(' ')[1]}/${data.premiered.split(' ')[0].toLowerCase()})` : 'Unknown'
        },{
          name: 'Studio', inline: true,
          value: `[**${data.studios[0]}**](https://myanimelist.net/anime/producer/${malProducers[data.studios[0]]}/)` || 'Unknown'
        },{
          name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          value: text.truncate(data.synopsis||'No Synopsis', 500, `...\n\n[**\`📖 Read Full Synopsis\`**](${data.url} 'Read More on MyAnimeList')`),
        },{
          name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          value: [
            `**${data.status === 'Finished Airing' ? 'Aired' : data.status === 'Currently Airing' ? 'Currently Airing' : 'Airs on'} (*${moment(data.aired.split('to')[0], 'll').fromNow()}*):** ${data.aired || 'Unknown'}`,
            '',
            `**Producers**: ${text.truncate(text.joinArray(data.producers.map(x => x === 'None found, add some' ? x : `[${x}](https://myanimelist.net/anime/producer/${malProducers[x]}/)`)||[]) || 'Unknown' ,900, '...')}`,
            '',
            `**Rating**: *${data.rating.replace('None', '') || 'Unrated'}*`,
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          ].join('\n')
        }
      ])
    );
  }
};
