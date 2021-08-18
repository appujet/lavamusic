const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const text = require('../../util/string');

module.exports = {
  name: 'malprofile',
  aliases: [ 'mal-of', 'malof', 'malstat', 'maluser' ],
  cooldown: { time: 10000 },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: 'Anime',
  description: 'Finds user profile on myanimelist based on the provided query.',
  parameters: [ 'Myanimelist Username' ],
  examples: [ 'profile alina' ],
  run: async function (client, message, args ){
    const { color } = client.config;
    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`\\${em.error} Please include the user to find on mal!`);
    };

    const response = await fetch(`https://api.jikan.moe/v3/user/${encodeURI(query)}/profile`)
    .then(res => res.json())
    .catch(() => {});

    if (!response || response.status){
      let err;
      if (response && response.status >= 500){
        err = `\\${em.error} I just received a server error from Myanimelist. MAL might be currently down. Please try again later.`
      } else if (response && response.status >=400){
        err = `\`${em.error} CLIENT_ERR\`: Alina attempted to send an invalidated request to MAL. Please contact my developer to fix this bug.`
      } else {
        err = `\\${em.error} I can't find **${query}** on mal`
      };
      return message.channel.send(err);
    };

    const fav_anime = text.joinArrayAndLimit(response.favorites.anime.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_manga = text.joinArrayAndLimit(response.favorites.manga.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_characters = text.joinArrayAndLimit(response.favorites.characters.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_people = text.joinArrayAndLimit(response.favorites.people.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setFooter(`Profile | \©️${new Date().getFullYear()} ${client.config.foot}`)
      .setAuthor(`${response.username}'s Profile`, response.image_url, response.url)
      .setDescription([
        text.truncate((response.about || '').replace(/(<([^>]+)>)/ig, ''), 350, `...[Read More](${response.url})`),
        `• **Gender**:\u2000\u2000${response.gender || 'Unspecified'}`,
        `• **From**\u2000\u2000${response.location || 'Unspecified'}`,
        `• **Joined MAL:**\u2000\u2000${moment(response.joined).format('dddd, do MMMM YYYY')}, *${moment(response.joined).fromNow()}*`,
        `• **Last Seen:**\u2000\u2000${moment(response.last_online).format('dddd, do MMMM YYYY')}, *${moment(response.last_online).fromNow()}*`
      ].join('\n'))
      .addFields([
        {
          name: 'Anime Stats', inline: true,
          value: '```fix\n' + Object.entries(response.anime_stats).map(([key, value]) => {
            const cwidth = 28;
            const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
            const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

            return ' • ' + name + ':' + spacing + value;
          }).join('\n') + '```'
        },{
          name: 'Manga Stats', inline: true,
          value: '```fix\n' + Object.entries(response.manga_stats).splice(0,10).map(([key, value]) => {
            const cwidth = 28;
            const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
            const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

            return ' • ' + name + ':' + spacing + value;
          }).join('\n') + '```'
        },{
          name: 'Favorite Anime',
          value: fav_anime.text + (!!fav_anime.excess ? ` and ${fav_anime.excess} more!` : '') || 'None Listed.'
        },{
          name: 'Favorite Manga',
          value: fav_manga.text + (!!fav_manga.excess ? ` and ${fav_manga.excess} more!` : '') || 'None Listed.'
        },{
          name: 'Favorite Characters',
          value: fav_characters.text + (!!fav_characters.excess ? ` and ${fav_characters.excess} more!` : '') || 'None Listed.'
        },{
          name: 'Favorite Staffs',
          value: fav_people.text + (!!fav_people.excess ? ` and ${fav_people.excess} more!` : '') || 'None Listed.'
        }
      ])
    );
  }
};
