const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'kick',
  aliases: [],
  guildOnly: true,
  permissions: [ 'KICK_MEMBERS' ],
  clientPermissions: [ 'KICK_MEMBERS' ],
  group: 'Moderation',
  description: 'Kick mentioned user from this server.',
  parameters: [ 'User Mention | ID', 'Kick Reason'],
  examples: [
    'kick @user breaking server rules',
    'kick @user',
    'kick 7827342137832612783'
  ],
  run: async (client, message, [member = '', ...reason] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the ID or mention the user to kick. [mention first before adding the reason]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} | ${message.author}, User could not be found! Please ensure the supplied ID is valid. Mention user for more precision on pinpointing user.`);
    };

    if (member.id === message.author.id){
      return message.channel.send(`${em.error} | ${message.author}, You cannot kick yourself!`);
    };

    if (member.id === client.user.id){
      return message.channel.send(`${em.error} | ${message.author}, Please don't kic me!`);
    };

    if (member.id === message.guild.ownerID){
      return message.channel.send(`${em.error} | ${message.author}, You cannot kick a server owner!`);
    };

    if (client.config.owners.includes(member.id)){
      return message.channel.send(`${em.error} | ${message.author}, No, you can't kick my developers through me!`)
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} | ${message.author}, You can't kick that user! He/She has a higher role than yours`)
    };

    if (!member.kickable){
      return message.channel.send(`${em.error} | ${message.author}, I couldn't kick that user!`);
    };

    await message.channel.send(`Are you sure you want to kick **${member.user.tag}**? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`${em.error} | ${message.author}, cancelled the kick command!`);
    };

    await member.send(`**${message.author.tag}** kicked you from ${message.guild.name}!\n**Reason**: ${reason.join(' ') || 'Unspecified.'}`)
    .catch(() => null);

    return member.kick({ reason: `ALi Kick Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_member => message.channel.send(`${em.success} Successfully kicked **${_member.user.tag}**`))
    .catch(() => message.channel.send(`${em.error} | Failed to kicked **${member.user.tag}**!`));
  }
};
