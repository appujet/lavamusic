const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'ban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: 'Moderation',
  description: 'Ban mentioned user from this server.',
  parameters: [ 'User Mention | ID', 'Ban Reason'],
  examples: [
    'ban @user breaking server rules',
    'ban @user',
    'ban 7827342137832612783'
  ],
  run: async (client, message, [member = '', ...reason] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the ID or mention the user to ban. [mention first before adding the reason]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} | ${message.author}, User could not be found! Please ensure the supplied ID is valid. Mention user for more precision on pinpointing user.`);
    };

    if (member.id === message.author.id){
      return message.channel.send(`${em.error} | ${message.author}, You cannot ban yourself!`);
    };

    if (member.id === client.user.id){
      return message.channel.send(`${em.error} | ${message.author}, Please don't ban me!`);
    };

    if (member.id === message.guild.ownerID){
      return message.channel.send(`${em.error} | ${message.author}, You cannot ban a server owner!`);
    };

    if (client.config.owners.includes(member.id)){
      return message.channel.send(`${em.error} | ${message.author}, No, you can't ban my developers through me!`)
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} | ${message.author}, You can't ban that user! He/She has a higher role than yours`)
    };

    if (!member.bannable){
      return message.channel.send(`${em.error} | ${message.author}, I couldn't ban that user!`);
    };

    await message.channel.send(`Are you sure you want to ban **${member.user.tag}**? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`${em.error} | ${message.author}, cancelled the ban command!`);
    };

    await member.send(`**${message.author.tag}** banned you from ${message.guild.name}!\n**Reason**: ${reason.join(' ') || 'Unspecified.'}`)
    .catch(() => null);

    return member.ban({ reason: `ALi Ban Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_member => message.channel.send(`${em.success} | Successfully banned **${_member.user.tag}**`))
    .catch(() => message.channel.send(`Failed to ban **${member.user.tag}**!`));
  }
};
