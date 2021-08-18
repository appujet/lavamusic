const { MessageEmbed, Collection } = require('discord.js');
const fetch = require('node-fetch');
const text = require('../../util/string');
const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'animeme',
  aliases: [ 'ameme' , 'animememe' , 'animemes' , 'animememes' , 'amemes' ],
  guildOnly: true,
  group: 'Anime',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Generate an anime meme fetched from selected <:reddit:767062345422864394> [Subreddits](https://reddit.com "Homepage"). Include `reload` parameter to reload meme cache. Memes generated are in order by default, add `r`, `random`, or `randomize` to randomize meme.',
  parameters: [ 'Reload tag', 'Randomization tag' ],
  examples: [
    'animeme',
    'ameme reload',
    'animeme random',
    'animemes reload',
    'amemes'
  ],
  run: async ( client, message, [parameter]) => {

    if (!client.collections.getFrom('memes', message.guild.id)) {
      client.collections.setTo('memes',message.guild.id, new Collection())
    }
    const { color } = client.config;
    const memes = client.collections.getFrom('memes', message.guild.id)

    if (!memes.size) await reloadMeme(memes, message)

    if (parameter && parameter.toLowerCase() === 'reload'){
      await reloadMeme(memes, message);

      if (!memes.size){
        return message.channel.send( new MessageEmbed().setDescription(`${em.error} | Could not fetch memes from <:reddit:767062345422864394> [Reddit](https://reddit.com/r/animemes)! Please report this to the bot owner. The API might be down or there might be changes on the API itself.`));
      };

      const data = memes.first()
      memes.delete(data.title)
      return message.channel.send(embedMeme(data))
    } else if (parameter && ['r','random','randomize'].includes(parameter.toLowerCase())){
      const data = memes.random();
      memes.delete(data.title);
      return message.channel.send(embedMeme(data));
    } else {
      const data = memes.first();
      memes.delete(data.title);
      if (!memes.size) {
        await reloadMeme(memes, message);
      };
      if (!memes.size) {
        return message.channel.send(
          new MessageEmbed().setColor(color)
          .setAuthor('Fetch Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
          .setThumbnail('https://i.imgur.com/qkBQB8V.png')
          .setFooter(`Animeme | \©️${new Date().getFullYear()} ${client.config.foot}`)
          .setDescription(
            `**${message.member.displayName}**, I could not fetch memes from <:reddit:767062345422864394> [r/animemes](https://reddit.com/r/animemes)!\n\n`
              + 'Please report this to the bot owner. The API might be down or there might be changes on the API itself.'
            )
          );
      };
      return message.channel.send(embedMeme(data));
    };
  }
};


async function reloadMeme(memes,message){

  if (memes.size){
    memes.clear();
  };

  const data = await fetch(`https://www.reddit.com/r/animemes.json`)
    .then(res => res.json())
    .catch(() => null);

  if (!data){
    return;
  };

  for ( const { data: { title, ups, downs, permalink, url, created_utc }} of data.data.children.filter( m => m.data.post_hint === 'image' && !m.data.pinned)){
    memes.set( title, {
      title, ups, downs,
      link: 'https://reddit.com/' + permalink,
      image: url,
      timestamp: created_utc * 1000
    });
  };

  return;
};

function embedMeme({ title, ups, downs, link, image, timestamp }){
  return new MessageEmbed()
  .setColor(color)
  .setTitle(title)
  .setURL(link)
  .setImage(image)
  .setTimestamp(timestamp)
  .setFooter(`Animeme | \©️${new Date().getFullYear()} ${client.config.foot}`);
};
