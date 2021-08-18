const { MessageEmbed, GuildEmoji } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const Pages = require('../../struct/Paginate');
const text = require('../../util/string');

module.exports = {
  name: 'top',
  aliases: [],
  guildOnly: true,
  group: 'Anime',
  description: 'Shows top anime (\\🛠️ currently broken)',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [ 'rank or range', 'type', 'subtype' ],
  examples: [
    'top'
  ],
  run: async (client, message, args) => {

    // disable access.. code needs further furnishing..
    return;
    const { color } = client.config;
    const str = args.join('');
    const regex_rank = /(\d{1,}\s*-\s*\d{1,})|\d{1,}/;
    const regex_type = /anime|manga|people|characters/;
    const regex_subtype = /favorite|bypopularity|airing|upcoming|tv|movie|ova|special|novels|oneshots|doujin|manhwa|manhua/;

    let rank = (str.match(regex_rank) || []) [0];
    let type = (str.match(regex_type) || []) [0];
    let subtype = (str.match(regex_subtype) || []) [0];

    if ([ 'people', 'characters' ].includes(type)){
      subtype = null;
    };

    if ('anime' === type){
      if ([ 'novels', 'oneshots', 'doujin', 'manhwa', 'manhua' ].includes(subtype)){
        subtype = null;
      };
    };

    if ('manga' === type){
      if ([ 'airing', 'upcoming', 'tv', 'movie', 'ova', 'special' ].includes(subtype)){
        subtype = null;
      };
    };

    if (!type){
      if ([ 'airing', 'upcoming', 'tv', 'movie', 'ova', 'special' ].includes(subtype)){
        type = 'anime';
      } else if ([ 'novels', 'oneshots', 'doujin', 'manhwa', 'manhua' ].includes(subtype)){
        type = 'manga';
      } else {
        type = 'anime';
      };
    };

    if (typeof rank !== 'string'){
      rank = [ Math.floor(Math.random() * 49) + 1 ];
    } else {
      if (isNaN(rank)){
        rank = rank.split('-').map(x => parseInt(x)).sort((A,B) => A - B);
      } else {
        rank = [ rank ];
      };
    };

    if (rank[1] && Math.abs(rank[1] - rank[0] > 15)){
      return message.channel.send(`Out of Range. limited to 15 range`)
    };

    let pages = [ Math.ceil(rank[0] / 50), Math.ceil(rank[1] / 50) ].filter(Boolean);

    if (pages[0] === pages[1]){
      pages = [ pages[0] ];
    };

    if (subtype === 'doujin' && !message.channel.nsfw){
      return message.channel.send(`You can't view doujinshis on a sfw channel! Move to a nsfw channel to view this.`)
    };

    let res = [];

    res[0] = await fetch(`https://api.jikan.moe/v3/top/${type || 'anime'}/${pages[0]}/${subtype || ''}`)
      .then(res => res.json())
      .catch(() => { return { top: []}; });

    if (pages[1]) {
      res[1] = await fetch(`https://api.jikan.moe/v3/top/${type || 'anime'}/${pages[1]}/${subtype || ''}`)
        .then(res => res.json())
        .catch(() => { return { top: []}; });
    };

    res = res.map(x => x.top ).flat().filter(x => {
      if (rank[1]){
        return x.rank >= rank[0] && x.rank <= rank[1];
      } else {
        return x.rank == rank[0];
      };
    });

    const page = new Pages();
    let index = 0;

    for (const info of res){
      const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(`MyAnimeList Top ${type.charAt(0).toUpperCase() + type.slice(1)}`)
      .setURL(info.url)
      .setTitle(`#${info.rank}\u2000\u2000|\u2000\u2000${info.title}${info.name_kanji ? ` (${info.name_kanji})` : ''}\u2000\u2000|\u2000\u2000${info.type || ''}`)
      .setThumbnail(info.image_url)
      .addFields([
        {
          name: info.hasOwnProperty('score') ? 'Score' : info.hasOwnProperty('favorites') ? 'Favorites' : 'Birthday',
          value: info.hasOwnProperty('score') ? (info.score || 0).toFixed(2) : info.hasOwnProperty('favorites') ? text.commatize(info.favorites) :info.hasOwnProperty('birthday') ? moment(info.birthday).format('dddd, do MMMM YYYY') : '\u200b',
          inline: info.hasOwnProperty('score') ? true : info.hasOwnProperty('birthday') ? false : true
        },{
          name: info.hasOwnProperty('episodes') ? 'Episodes' : info.hasOwnProperty('volumes') ? 'Volumes' : info.hasOwnProperty('animeography') ? 'Animeography' : 'Favorites',
          value:  info.hasOwnProperty('episodes') ? info.episodes || 'Unknown' : info.hasOwnProperty('volumes') ? info.volumes || 'Unknown' : info.hasOwnProperty('animeography') ? info.animeography.map(x => `[**${x.name}**](${x.url.split('/').slice(0,5).join('/')})`).join('\n') : text.commatize(info.favorites),
          inline: info.hasOwnProperty('animeography') ? false : true
        },{
          name: info.members ? 'Members' : info.mangaography ? 'Mangaography' : 'Favorites',
          value: info.members ? text.commatize(info.members) : info.mangaography ? info.mangaography.map(x => `[**${x.name}**](${x.url.split('/').slice(0,5).join('/')})`).join('\n') : text.commatize(info.favorites),
          inline: info.hasOwnProperty('mangaography') ? false : true
        },{
          name: info.hasOwnProperty('start_date') ? 'Start Date' : 'Favorites',
          value: info.hasOwnProperty('start_date') ? info.start_date : text.commatize(info.favorites),
          inline: true
        },{
          name: 'End Date',
          value: info.start_date,
          inline: true
        }
      ]).setFooter(`Top ${type.charAt(0).toUpperCase() + type.slice(1)} | \©️${new Date().getFullYear()} ${client.config.foot}`)

      if (type === 'characters'){
        embed.spliceFields(3,5)
      } else if (type === 'people'){
        embed.spliceFields(2,5)
      };

      if (res.length > 1){
        embed.addField('\u200b', `Page ${index + 1} of ${res.length}.`)
      };

      index++;
      page.add(embed);
    };

    msg = await message.channel.send(page.firstPage);

    if (page.size === 1){
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
          msg.edit(page.previous());
        break;
        case next instanceof GuildEmoji ? next.name : next:
          msg.edit(page.next());
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
