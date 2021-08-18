const { MessageEmbed, GuildEmoji } = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');

const Pages = require('../../struct/Paginate');
const text = require('../../util/string');

module.exports = {
  name: "manga",
  aliases: [ 'comic', 'manhwa', 'manhua' ],
  guildOnly: true,
  cooldown: {
    time: 10000,
    message: 'Oops! You are going too fast! Please slow down to avoid being rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
  group: 'Anime',
  description: 'Searches for a Manga / Manhwa / Manhua in  [MyAnimeList](https://myanimelist.net.co "Homepage"), or shows Seishun Buta Yarou if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'manga',
    'comic rascal does not dream',
    'manhwa solo leveling',
    'manhua king\'s avatar'
  ],
  run: async (client, message, args) => {

    const { color } = client.config;
    const query = args.join(' ') || 'Seishun Buta Yarou';

    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setDescription(`Searching for manga titled **${query}** on <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setFooter(`Manga Query with | \©️${new Date().getFullYear()} ${client.config.foot}`);

    let msg = await message.channel.send(embed);

    const data = await fetch(`https://api.jikan.moe/v3/search/manga?q=${encodeURI(query)}&page=1`).then( res => res.json())

    embed.setColor('RED').setAuthor(
        !data.error && !data.results.length
        ? 'None Found'
        : 'Response Error'
        ,'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'
      ).setDescription(
        !data.error && !data.results.length
        ? [
          `**${message.member.displayName}**, No results were found for **${query}**!\n`,
          `If you believe this manga exists, try the following methods:`,
          `• Try the alternative names (e.g. English, Native, Romaji).`,
          `• Include the volume number (if it exists).`
        ].join('\n')
        : `[MyAnimeList](https://myanimelist.net 'Homepage') responded with error code ${data.status}.`
      );

    if (!data || data.error || !data.results.length){
      return await msg.edit(embed).catch(()=> null) || message.channel.send(embed);
    };

    const elapsed = Date.now() - message.createdAt;
    const pages = new Pages();

    for (const res of data.results.slice(0,10)) {
      pages.add(
        new MessageEmbed()
        .setAuthor(res.title, res.image_url, res.url)
        .setColor(color)
        .setThumbnail(res.image_url)
        .setFooter([
          `Search duration: ${Math.abs(elapsed / 1000).toFixed(2)} seconds`,
          `Page ${pages.size + 1} of ${data.results.slice(0,10).length}`,
          `Manga Query with MAL | \©️${new Date().getFullYear()} Alina`
        ].join('\u2000\u2000•\u2000\u2000'))
        .addFields([
          { name: 'Type', value: res.type, inline: true },
          { name: 'Status', value: res.publishing ? 'Publishing' : 'Finished', inline: true},
          { name: 'Chapters', value: res.chapters, inline: true },
          { name: 'Members', value: text.commatize(res.members), inline: true },
          { name: 'Score', value: res.score, inline: true },
          { name: 'Volumes', value: res.volumes, inline: true },
          { name: 'Start Date', value: moment(res.start_date).format('dddd, Do MMMM YYYY'), inline: true },
          { name: 'End Date', value: res.end_date ? moment(res.end_date).format('dddd, Do MMMM YYYY') : 'Unknown', inline: true },
          { name: '\u200b', value: res.synopsis || '\u200b', inline: false }
        ])
      );
    }

    msg = await msg.edit(pages.firstPage).catch(()=>null) || await message.channel.send(pages.firstPage);

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
