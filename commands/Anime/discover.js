const { MessageEmbed, GuildEmoji } = require('discord.js');
const { convert: toMarkdown } = require('html-to-markdown');
const { decode } = require('he');

const Paginate = require('../../struct/Paginate');
const Profile = require('../../struct/DiscoveryProfile');
const text = require('../../util/string');

module.exports = {
  name: 'discover',
  aliases: [],
  guildOnly: true,
  group: 'Anime',
  description: 'Generate a set of handpicked <Anime/Manga> recommendations for a user.',
  clientPermissions: [ 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS' ],
  parameter: [ 'Manga', 'Anime' ],
  examples: [
    'discover anime',
    'discover manga'
  ],
  run: async ( client, message, [category = '']) => {

    category = category.toLowerCase();

    const embed = new MessageEmbed()
    .setDescription(`**${message.member.displayName}**, Please specify if it's \`ANIME\` or \`MANGA\`.`)
    .setAuthor('Unrecognized Category!','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setThumbnail('https://i.imgur.com/qkBQB8V.png')
    .setColor('RED')
    .setFooter(`Discover | \©️${new Date().getFullYear()} ${client.config.foot}`);

    if (!category || !['anime','manga'].includes(category)){
      return message.channel.send(embed);
    };

    if (!client.collections.exists('discovery', message.author.id)){
      client.collections.setTo('discovery', message.author.id, new Profile(message.member));
    };

    const profile = client.collections.getFrom('discovery', message.author.id);
    let res;

    if (!profile.hasData){
      res = await profile.generateList().fetch();
    };

    if (profile.isExpired){
      res = await profile.clearList().generateList().fetch();
    };

    if (res && res.errors.length){
      return message.channel.send(
        embed.setAuthor('Oops! An unexpected error occured!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setThumbnail(null)
        .setDescription([
          `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`,
          'This might be an issue on Anilist\'s end. Please try again in a minute\n',
          'If this doesn\'t resolve in few hours, you may contact **Blacky#6618**.',
          `You can also make an issue on the [repository](${client.config.websites.github})`,
          'or [join](https://discord.gg/DsKaXx84AK) Alina\'s dev server instead.'
        ].join(' '))
      );
    };

    let index = 0;
    const data = profile.get(category);
    const topic = category.charAt(0).toUpperCase() + category.slice(1);

    const discoveryPages = new Paginate(
      new MessageEmbed()
      .setColor(color)
      .setTitle(`Get Random ${topic} Recommendations with your Discovery Queue!`)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription([
        `Your ${topic} Recommendations Discovery Queue is unique and totally random generated.`,
        `5 random genres out of 17 total genres are selected and random ${topic} are picked out`,
        `of those genres for you. You get a different ${topic} recommendations daily so don't`,
        'miss the chance to discover every day.'
      ].join(' '))
      .setFooter(`Discover ${topic}\u2000|\u2000\©️${new Date().getFullYear()} ${client.config.foot}`)
      .addFields([
        {
          name: '\u200b',
          value: profile[category].genres.map(g => `\\🟢 ${g}`).join('\n')
        },
        {
          name: ![true][profile[category].viewcount - 1] ? `Times Viewed Today:\u2000**${profile[category].viewcount}**` : '\u200b',
          value: '\u200b'
        },
        {
          name: '\u200b',
          value: 'Start Your Queue by clicking <:next:767062244034084865> below!!'
        }
      ])
    );

    for (const info of data){
      discoveryPages.add(
        new MessageEmbed()
        .setColor(info.coverImage.color || color)
        .setAuthor([
          profile[category].genres[index],
          text.truncate(info.title.romaji || info.title.english || info.title.native),
          client.anischedule.info.mediaFormat[info.format]
        ].join('\u2000|\u2000'))
        .setDescription((info.studios.nodes || []).slice(0,1).map( x => `[${x.name}](${x.siteUrl})`).join(''))
        .setThumbnail(info.coverImage.large)
        .setFooter(`Discover ${topic}\u2000|\u2000\©️${new Date().getFullYear()} ${client.config.foot}`)
        .addFields([
          {
            name: 'Other Titles',
            value: [
              `•\u2000\**Native:**\u2000${info.title.native || 'None'}.`,
              `•\u2000\**Romanized:**\u2000${info.title.romaji || 'None'}`,
              `•\u2000\**English:**\u2000${info.title.english || 'None'}`
            ]
          },
          {
            name: 'Genres',
            value: text.joinArray(info.genres) || 'MISSING_INFO'
          },
          {
            name: 'Started',
            value: [
              client.anischedule.info.months[info.startDate.month - 1],
              info.startDate.day,
              info.startDate.year
            ].filter(Boolean).join(' ') || 'Unknown',
            inline: true
          },
          {
            name: category === 'anime' ? 'Episodes' : 'Chapters',
            value: info.episodes || info.chapters || 'Unknown',
            inline: true
          },
          {
            name: category === 'anime' ? 'Duration (in minutes)' : 'Volumes',
            value: info.duration || info.volumes || 'Unknown',
            inline: true
          },
          {
            name: '\u200b',
            value: text.truncate(toMarkdown(decode(info.description || '').replace(/<br>/g,'\n')), 1000, `[…Read More](https://myanimelist.net/anime/${info.idMal})`) || '\u200b'
          }
        ])
      );
      index++;
    };

    const discoveryPrompt = await message.channel.send(discoveryPages.currentPage);
    const next = client.emojis.cache.get('767062244034084865') || '▶';
    const filter = (_, user) => user.id === message.author.id;
    const collector = discoveryPrompt.createReactionCollector(filter);

    await discoveryPrompt.react(next);
    let timeout = setTimeout(() => collector.stop(), 90000);

    collector.on('collect', async (reaction) => {
      if (next === reaction.emoji.name){
        await discoveryPrompt.edit(discoveryPages.next());
      } else if (next instanceof GuildEmoji){
        if (reaction.emoji.name === next.name){
          await discoveryPrompt.edit(discoveryPages.next());
        } else {
          // Do nothing
        };
      };

      if (discoveryPages.currentIndex === discoveryPages.size - 1){
        return collector.stop();
      };

      await reaction.users.remove(message.author.id);
      return timeout.refresh();
    });

    collector.on('end', () => discoveryPrompt.reactions.removeAll());

    return;
  }
};
