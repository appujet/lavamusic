const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const fetch = require('node-fetch');

const text = require('../../util/string');

const badge = ' [MyAnimeList](https://myanimelist.net \'Homepage\')';

module.exports = {
  name: 'character',
  aliases: [ 'anichar' , 'char' , 'c' ],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: 'Anime',
  description: 'Searches for a character in [MyAnimeList](https://myanimelist.net "Homepage"), or Alina\'s character information if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'character',
    'anichar Akina',
    'anichar Sakuta Azusagawa',
    'char Rio Futaba',
    'c Kaede Azusagawa'
  ],
  run: async (client, message, args) => {
    const { color } = client.config;
    const query = args.join(' ') || 'Alina';

    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setDescription(`Searching for character named **${query}** on [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setFooter(`Character Query with  | \©️${new Date().getFullYear()}${client.config.foot}`);

    const msg = await message.channel.send(embed);

    let data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`).then(res => res.json());

    const errstatus = {
      "404": `No results were found for **${query}**!\n\nIf you believe this character exists, try their alternative names.`,
      "429": `I am being rate-limited in ${badge}. Please try again Later`,
      "500": `Could not access ${badge}. The site might be currently down at the moment`,
      "503": `Could not access ${badge}. The site might be currently down at the moment`,
    }

    embed.setColor('RED')
    .setAuthor(data.status == 404 ? 'None Found' : 'Response Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} responded with HTTP error code ${data.status}`}`)
    .setThumbnail('https://i.imgur.com/qkBQB8V.png');

    if (!data || data.error){
      return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
    };

    const { results : [ { ali_id } ] } = data;

    let res = await fetch(`https://api.jikan.moe/v3/character/${ali_id}`)
    .then(res => res.json())
    .catch(() => {});

    embed.setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} responded with HTTP error code ${data.status}`}`);

    if (!res || res.error){
      return await msg.edit(embed).catch(()=>{}) || message.channel.send(embed);
    };

    const elapsed = Date.now() - msg.createdAt;
    const [ anime, manga ] = ['animeography', 'mangaography'].map(props => {
      const data = res[props].map(x => {
        const url = x.url.split('/').slice(0,5).join('/');
        return '[' + x.name + '](' + url + ') (' + x.role + ')';
      });
      return text.joinArrayAndLimit(data, 1000, ' • ');
    });
    const mediastore = { anime, manga };

    embed.setAuthor(`${res.name} ${res.name_kanji ? `• ${res.name_kanji}` : ''}`, null, res.url)
    .setThumbnail(res.image_url)
    .setColor(color)
    .setDescription(text.truncate(res.about.replace(/\\n/g,''),500,`... [Read More](${res.url})`))
    .setFooter(  `Character Query with | \©️${new Date().getFullYear()} Alina`)
    .addFields([
      ...['Anime', 'Manga'].map(media => {
        const store = mediastore[media.toLowerCase()];
        return {
          name: `${media} Appearances (${res[media.toLowerCase() + 'ography'].length || 0})`,
          value: `${store.text || 'None'} ${store.excess ? `\n...and ${store.excess} more!` : ''}`
        };
      }),
      ..._.chunk(res.voice_actors ,3).slice(0,3).map((va_arr, index) => {
        return {
          inline: true,
          name: index === 0 ? `Seiyuu (${res.voice_actors.length})` : '\u200b',
          value: va_arr.map((va, i) => {
            const flag = client.anischedule.info.langflags
            .find(m => m.lang === va.language).flag;
            if (index === 2 && i === 2){
              return `...and ${res.voice_actors.length - 8} more!`;
            } else {
              return `${flag || va.language} [${va.name}](${va.url})`;
            };
          }).join('\n') || '\u200b'
        };
      })
    ]);

    return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
  }
};
