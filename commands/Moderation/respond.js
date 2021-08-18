const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'respond',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'Moderation',
  description: 'Respond to user suggestion',
  parameters: [ 'Message ID', 'accept/deny', 'reason' ],
  examples: [
    'respond 690105173087223812 deny Doesn\'t make much sense to do this'
  ],
  run: async (client, message, [id, action = '', ...reason]) => {

    const channelID = (client.guildProfiles
    .get(message.guild.id) || {})
    .featuredChannels.suggest;

    const embed = new MessageEmbed()
    .setColor('RED')
    .setFooter(`Respond to Suggestion | \©️${new Date().getFullYear()} Alina`);

    if (!channelID){
      return message.channel.send(
        embed.setAuthor('Suggest Channel not Set!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.author.tag}**, the **Suggestion Channel** for this server has not been set!`,
          'If you are a server administrator, you may set the channel by typing:\n',
          
          `\`${client.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      );
    };

    const channel = message.guild.channels.cache.get(channelID);

    if (!channelID){
      return message.channel.send(
        embed.setAuthor('Suggest Channel Invalid!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.author.tag}**, the **Suggestion Channel** for this server was invalidated.`,
          'If you are a server administrator, you may set the channel again by typing:\n',
          `\`${client.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      );
    };

    if (!id){
      return message.channel.send(
        embed.setDescription('You need to supply the **message ID** of the suggestion')
        .setAuthor('Message ID not Found!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      );
    };

    if (!['accept', 'deny'].includes(action.toLowerCase())){
      return message.channel.send(
        embed.setDescription('Please specify if you want to `accept` or `deny` the suggestion')
        .setAuthor('Response Undefined!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      );
    };

    if (!reason.length || reason.join(' ').length > 1024){
      return message.channel.send(
        embed.setDescription('You need to supply a reason not exceeding 1024 characters')
        .setAuthor('Could not parse response reason!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      );
    };

    const suggestion = await channel.messages.fetch(id).catch(() => undefined);

    if (!suggestion ||
      suggestion.author.id !== client.user.id ||
      !suggestion.embeds.length ||
      !(suggestion.embeds[0].title || '').endsWith('Suggestion')
    ){
      return message.channel.send(
        embed.setAuthor('Suggestion not Found', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`I can't seem to find the suggestion with the message ID **${id}** in **${channel}**.`)
      );
    };

    if (suggestion.embeds[0].fields.length > 1){
      return message.channel.send(
        embed.setAuthor('Suggestion already responded with', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`**${suggestion.embeds[0].fields[0].value.replace('Accepted by','')}** already responded to this suggestion!`)
      );
    };

    if (!suggestion.editable){
      return message.channel.send(
        embed.setAuthor('Suggestion can\'t be edited.', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription('The suggestion has somehow been invalidated (cause unknown)')
      );
    };

    suggestion.embeds[0].fields[0].value = action.toLowerCase() === 'accept'
    ? `Accepted by **${message.author.tag}**`
    : `Denied by **${message.author.tag}**`;

    return suggestion.edit(
      new MessageEmbed(suggestion.embeds[0])
      .setColor(action.toLowerCase() === 'accept' ? 'GREEN' : 'RED')
      .addField('Reason', reason.join(' '))
    ).then(()=> message.react('✅'))
    .catch(()=> embed.setAuthor('Suggestion can\'t be edited.', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription('The suggestion has somehow been invalidated (cause unknown)'));
  }
};
