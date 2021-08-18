const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suggest',
  aliases: [],
  guildOnly: true,
  group: 'General',
  description: 'Suggest something for the server. If you have suggestion for the bot instead please use the feedback command or join our support server',
  clientPermissions: [ 'EMBED_LINKS', 'ADD_REACTIONS' ],
  parameters: [ 'Suggestion Message' ],
  examples: [
    'suggest please remove some of the inactive members...'
  ],
  run: async (client, message, args) => {

    const embed = new MessageEmbed()
    .setFooter(`Suggest | \©️${new Date().getFullYear()} ${client.config.foot}`)
    .setColor('RED');

    if (!args.length){
      return message.channel.send(
        embed.setAuthor('No Message', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`**${message.member.displayName}**, Please include your **suggestion message**!`)
        .addField('Example', '```m!suggest Please remove some inactive members...```')
      );
    };

    const id = client.guildProfiles.get(message.guild.id).suggestChannel;
    const channel = message.guild.channels.cache.get(id);

    if (!channel){
      return message.channel.send(
        embed.setAuthor('Channel Not Found!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.member.displayName}**, could not find **Suggestion Channel** for this server!\n`,
          `If you are a server administrator, you may set the channel by typing:`,
          `\`${client.config.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      )
    };

    if (!channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS')){
      return message.channel.send(
        embed.setAuthor('Missing Permissions', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription([
          `**${message.member.displayName}**, The channel ${channel} does not allow me to post your suggestion there!`,
          `I need to have the following permissions: \`View Channel\`, \`Send Messages\`, and \`Embed Links\`\n\n`
          `If you are a server administrator/moderator, please change my permission overwrites on the aformentioned channel.`
        ].join(''))
      );
    };

    return channel.send(
      embed.setTitle(`${message.member.displayName}'s Suggestion`)
      .setColor('YELLOW')
      .setDescription(args.join(' '))
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true}))
      .addField('Status', 'Under Review', true)
    ).then(async suggestion => {
      await message.react('✅').catch(() => {})
      await suggestion.react('⬆️').catch(() => {})
      await suggestion.react('⬇️').catch(() => {})
      return;
    });
  }
};
