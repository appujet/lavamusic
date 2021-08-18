const { MessageEmbed } = require('discord.js');
const { convert: toMarkdown } = require('html-to-markdown');
const { decode } = require('he');

const text = require('../../util/string');
const animeDB = require('../../assets/json/anime.json');

module.exports = {
  name: 'anirandom',
  aliases: [ 'anirand', 'anirecommend' ],
  cooldown: {
    time: 15000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  group: 'Anime',
  description: 'Generates a random anime recommendation. Recommends a Hentai if used on a nsfw channel.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameter: [],
  examples: [
    'anirandom',
    'anirand',
    'anirecommend'
  ],
  get examples(){ return [this.name, ...this.aliases]; },
  run: async ( client, message ) => {

    // Indicator that Alina is trying to fetch these data
    message.channel.startTyping();
    const { color } = client.config;
    const db = animeDB.filter(a => message.channel.nsfw === a.isAdult);
    const { ids: { al: id }} = db[Math.floor(Math.random() * db.length)];

    const { errors , data } = await client.anischedule.fetch(`query ($id: Int) { Media(id: $id){ siteUrl id idMal synonyms isAdult format startDate { year month day } episodes duration genres studios(isMain:true){ nodes{ name siteUrl } } coverImage{ large color } description title { romaji english native userPreferred } } }`, { id });

    const embed = new MessageEmbed().setColor('RED')
    .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Alina`);

    // If errored due to ratelimit error
    if (errors && errors.some(x => x.status === 429)){
      return message.channel.send(
        embed.setAuthor('Oh no! Alina has been rate-limited', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.member.displayName}**, please try again in a minute.\n\n`,
          `If this error occurs frequently, please contact **Blacky#6618**.`
        ].join(''))
      );
    };

    // If errored due to validation errors
    if (errors && errors.some(x => x.status === 400)){
      return message.channel.send(
        embed.setAuthor('Oops! A wild bug 🐛 appeared!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`,
          `Please contact **Blacky#6618** for a quick fix.\n`,
          `You can make an issue on the [repository](${client.config.github}) or [join](https://discord.gg/DsKaXx84AK) Alina's dev server instead.`
        ].join(''))
      );
    };

    // If errored due to other reasons
    if (errors){
      return message.channel.send(
        embed.setAuthor('Oops! An unexpected error occured!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`,
          `This might be an issue on Anilist's end. Please try again in a minute\n`,
          `If this doesn't resolve in few hours, you may contact **Blacky#6618**`,
          `You can also make an issue on the [repository](${client.config.github}) or [join](https://discord.gg/gfcv94hDhv) ALi's dev server instead.`
        ].join(''))
      );
    };

    return message.channel.send(
      embed.setColor(data.Media.coverImage.color || color)
      .setAuthor([
        text.truncate(data.Media.title.romaji || data.Media.title.english || data.Media.title.native),
        client.anischedule.info.mediaFormat[data.Media.format]
      ].join('\u2000|\u2000'), null, data.Media.siteUrl)
      .setDescription(data.Media.studios.nodes.map(x => `[${x.name}](${x.url})`).join('\u2000|\u2000')||'')
      .addFields([
        {
          name: 'Other Titles',
          value: [
            `•\u2000**Native**:\u2000${data.Media.title.native || 'None'}.`,
            `•\u2000**Romanized**:\u2000${data.Media.title.romaji || 'None'}.`,
            `•\u2000**English**:\u2000${data.Media.title.english || 'None'}.`
          ].join('\n')
        },{
          name: 'Genres',
          value: text.joinArray(data.Media.genres) || '\u200b'
        },{
          name: 'Started',
          value: [
            client.anischedule.info.months[data.Media.startDate.month || 0],
            data.Media.startDate.day || '',
            data.Media.startDate.year || ''
          ].filter(Boolean).join(' ') || 'Unknown',
          inline: true
        },{
          name: 'Episodes',
          value: data.Media.episodes || 'Unknown',
          inline: true
        },{
          name: 'Duration (in minutes)',
          value: data.Media.duration || 'Unknown',
          inline: true
        },{
          name: '\u200b',
          value: text.truncate(toMarkdown(decode((data.Media.description || '').replace(/<br>/g,''))), 1000, ` […Read More](https://myanimelist.net/anime/${data.Media.idMal})`) || '\u200b'
        }
      ]).setThumbnail(data.Media.coverImage.large)
    ).then(() => message.channel.stopTyping());
  }
};
