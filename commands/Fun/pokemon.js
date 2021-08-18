const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const text = require('../../util/string');

module.exports = {
  name: 'pokemon',
  aliases: [ 'pokedex', 'pokémon', 'pokédex' ],
  group: 'Fun',
  description: 'Find a specific pokemon using the pokédex, or pikachu if no query is provided.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'pokemon',
    'pokedex pikachu',
    'pokémon clefairy',
    'pokédex jigglypuff'
  ],
  run: async (client, message, args) => {
    const { color } = client.config;
    const query = args.join(' ') || 'Pikachu';
    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setFooter(`Pokédex - The Pokémon Company\©️ | \©️${new Date().getFullYear()} ${client.config.foot}`);

    const prompt = await message.channel.send(
      embed.setDescription(`Searching pokédex for **${query}**`)
      .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    );

    const data = await fetch(`https://some-random-api.ml/pokedex?pokemon=${encodeURI(query)}`)
    .then(res => res.json())
    .catch(()=>null);

    embed.setColor('RED')
    .setThumbnail(null)
    .setAuthor('Pokédex Unavailable', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription('Pokedex provider responded with error 5xx. Please try again later.')

    if (!data){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    embed.setAuthor('Pokémon entry coudn\'t be found', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription(`**${message.author.tag}**, I can't seem to find **${query}** from the Pokédex!`)

    if (data.error){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    data.sprites = data.sprites || {};
    data.stats = data.stats || {};
    data.family.evolutionLine = data.family.evolutionLine || [];

    embed.setColor(color)
    .setDescription('')
    .setThumbnail(data.sprites.animated || data.sprites.normal || null)
    .setAuthor(`Pokédex entry #${data.id} ${data.name.toUpperCase()}`,'https://i.imgur.com/uljbfGR.png', 'https://pokemon.com/us')
    .addFields([
      { name: 'Info', value: data.description || '???' },
      { name: 'Type', value: data.type.join('\n') || '???', inline: true },
      { name: 'Abilities', value: data.abilities.join('\n') || '???', inline: true },
      {
        name: 'Build', inline: true,
        value: [
          `Height: **${data.height || '???'}**`,
          `Weight: **${data.weight || '???'}**`,
          `Gender: **${text.joinArray(data.gender)}**`
        ].join('\n')
      },
      { name: 'Egg Groups', value: data.egg_groups.join('\n') || '???', inline: true },
      {
        name: 'Stats', inline: true,
        value: [
           `HP: **${data.stats.hp || '???'}**`,
           `ATK: **${data.stats.attack || '???'}**`,
           `DEF: **${data.stats.defense || '???'}**`
        ].join('\n')
      },
      {
        name: 'SP.Stats', inline: true,
        value: [
          `SP.ATK: **${data.stats.sp_atk || '???'}**`,
          `SP.DEF: **${data.stats.sp_def || '???'}**`,
          `SPEED: **${data.stats.speed || '???'}**`
        ].join('\n')
      },
      { name: 'Generation', value: data.generation || '???', inline: true },
      { name: 'Evolution Stage', value: text.ordinalize(data.family.evolutionStage || '???'), inline: true },
      { name: 'Evolution Line', value: data.family.evolutionLine.join(' \\👉 ') || '???', inline: true }
    ]);

    return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
  }
};
