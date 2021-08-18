const { MessageEmbed, GuildEmoji } = require('discord.js');
const _ = require('lodash');
const watching = require('require-text')('../../assets/graphql/Watching.graphql',require);
const em = require('../../assets/json/emojis.json');
const list = require(`../../models/GuildWatchlist`);
const Page = require(`../../struct/Paginate`);
const text = require(`../../util/string`);

module.exports = {
  name: 'watching',
  aliases: [ 'watchlist', 'list' ],
  guildOnly: true,
  cooldown: {
    time: 60000,
  },
  group: 'General',
  description: 'View list of anime this server is subscribed to.',
  requiresDatabase: true,
  clientPermissions: [ 'EMBED_LINKS', 'MANAGE_MESSAGES' ],
  examples: [
    'watching',
    'watchlist',
    'list'
  ],
  run: (client, message) => list.findById(message.guild.id, async (err, doc) => {

    if (err){
      return message.channel.send(`${em.error} | \`[DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    const embed = new MessageEmbed()
    .setColor('RED')
    .setFooter(`Anischedule Watchlist | \©️${new Date().getFullYear()} Alina`)

    const anischedch = message.guild.channels.cache.get(doc.channelID);

    if (!anischedch){
      return message.channel.send(`${em.error} **${message.member.displayName}**, This server's anischedule feature has been disabled.`);
    } else if (!doc.data.length){
      return message.channel.send(
        embed.setAuthor('No Subscription','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
      );
    } else {
      const entries = [];
      const watched = doc.data;
      let page = 0
      let hasNextPage = false;

      do {
        const res = await client.anischedule.fetch(watching, {watched, page});

        if (res.errors){
          return message.channel.send(
            embed.setAuthor('AniList Error', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
            .setDescription('Received error from anilist:\n' + errors.map(x => x.message).join('\n'))
          );
        } else if (!entries.length && !res.data.Page.media.length){
          return message.channel.send(
            embed.setAuthor('No Subscription','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
            .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
          );
        } else {
          page = res.data.Page.pageInfo.currentPage + 1;
          hasNextPage = res.data.Page.pageInfo.hasNextPage;
          entries.push(...res.data.Page.media.filter(x => x.status === 'RELEASING'));
        };
      } while (hasNextPage);
      const { color } = client.config;
      const chunks = entries.sort((A,B) => A.id - B.id).map(entry => {
        const id = ' '.repeat(6 - String(entry.id).length) + String(entry.id);
        const title = text.truncate(entry.title.romaji, 42, '...');
        return `•\u2000\u2000\`[ ${id} ]\` [**${title}**](${entry.siteUrl})`;
      });
      const descriptions = _.chunk(chunks, 20).map( d => d.join('\n'));

      const pages = new Page(descriptions.map((d,i) => {
        return new MessageEmbed()
        .setColor(color)
        .setDescription(d)
        .setTitle(`Current Anischedule Subscription (${entries.length} entries!)`)
        .setFooter([
          `Anischedule Watchlist`,
          `Page ${i + 1} of ${descriptions.length}`,
          `\©️${new Date().getFullYear()} ${client.config.foot}`
        ].join('\u2000\u2000•\u2000\u2000'))
        .addField('Tips', [
          `- Use [\`${client.prefix}watch\`](https://discord.gg/uAVaeCP9VH) to add subscription`,
          `- Use [\`${client.prefix}unwatch\`](https://discord.gg/uAVaeCP9VH) to remove subscription`,
          `- Use \`${client.prefix}nextep <anime title>\` to check episode countdown`
        ].join('\n'))
      }));

      const msg = await message.channel.send(pages.firstPage);

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

    return;
    };
  })
};
