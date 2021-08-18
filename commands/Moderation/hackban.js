const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'hackban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: 'Moderation',
  description: 'bans a user even if they are not in the server.',
  parameters: [ 'User ID', 'Ban Reason'],
  examples: [
    'hackban 7823713678123123123',
    'hackban 2345678765423567817 not following discord tos'
  ],
  run: async (client, message, [user = '', ...reason] ) => {

    if (!user.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the ID of the user to ban.`);
    };

    user = await client.users
    .fetch(user.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!user){
      return message.channel.send(`${em.error} | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    };

    if (user.id === message.guild.ownerID){
      return message.channel.send(`${em.error} | ${message.author}, You cannot ban a server owner!`);
    };

    member = await message.guild.members
    .fetch(user.id)
    .catch(() => false);

    if (!!member){
      return message.channel.send(`${em.error} | ${message.author}, Hackban will skip a role validation check! Please use \`ban\` command instead if the user is in your server.`);
    };

    if (user.id === message.author.id){
      return message.channel.send(`${em.error} | ${message.author}, You cannot ban yourself!`);
    };

    if (user.id === client.user.id){
      return message.channel.send(`${em.error} | ${message.author}, Please don't ban me!`);
    };

    if (client.config.owners.includes(user.id)){
      return message.channel.send(`${em.error} | ${message.author}, No, you can't ban my developers through me!`)
    };

    await message.channel.send(`Are you sure you want to ban **${user.tag}** from this server? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };

    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`${em.error} | ${message.author}, cancelled the hackban command!`);
    };

    return message.guild.members.ban(user, { reason: `Alina Hackban Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_user => message.channel.send(`${em.success} | Successfully banned **${_user.tag}** from this server!`))
    .catch(() => message.channel.send(`${em.error} | Failed to ban **${user.tag}**!`));
  }
};
