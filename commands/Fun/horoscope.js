const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const signs = require('../../util/constants').horoscope;
const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'horoscope',
  aliases: [],
  group: 'Fun',
  description: 'Find out your horoscope for today!',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'horoscope libra',
    'horoscope sagittarius'
  ],
  run: async (client, message, [sign] ) => {

    const { color } = client.config; 
    if (!sign){
      return message.channel.send(`${em.error} | ${message.author}, Please give me a sign to get the horoscope of!`);
    };

    if (!Object.keys(signs).includes(sign.toLowerCase())){
      return message.channel.send(`${em.error} | ${message.author}, **${sign}** is not a valid sign!`);
    };

    const data = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`)
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Horoscope API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setFooter(`Horoscope | \©️${new Date().getFullYear()} ${client.config.foot}`)
      .setAuthor(signs[sign.toLowerCase()] + ' ' + data.sunsign || sign)
      .setDescription(data.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))
      .addFields([
        { name: 'Mood', inline: true, value: data.meta.mood || '\u200b' },
        { name: 'Intensity', inline: true, value: data.meta.intensity || '\u200b' },
        { name: 'Keywords', inline: true, value: data.meta.keywords || '\u200b' }
      ])
    );
  }
};
