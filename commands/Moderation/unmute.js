module.exports = {
  name: 'unmute',
  aliases: [ 'undeafen', 'unsilence', 'speak' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: 'Moderation',
  description: 'Unmutes a muted user from this server.',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'unmute @user',
    'unmute 2283746574829102938'
  ],
  run: async (client, message, [member = ''] ) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    if (!muteID){
      return message.channel.send(`${em.error} | Muterole is yet to be set! Do so by using \`setmute\` command.`);
    };

    const muted = message.guild.roles.cache.get(muteID);

    if (!muted){
      return message.channel.send(`${em.error} | The role set for muting members could not be found! Set a new one by using \`setmute\` command.`);
    };

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | Please provide the ID or mention the user to unmute.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} | Unable to unmute user: User not found.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} | ${message.author}, you cannot unmute user whose roles are higher than yours!`)
    } else if (member.id === client.user.id){
      return message.channel.send(`${em.error} | ${message.author}, Yay, I've been unmuted!`);
    } else if (member.user.bot){
      return message.channel.send(`${em.error} | ${message.author}, I cannot unmute bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`${em.error} | ${message.author}, why, you're already talking!`);
    } else if (!member.roles.cache.has(muted.id)){
      return message.channel.send(`${em.error} | ${message.author}, **${member.user.tag}** is not muted!`);
    };

    return member.roles.remove(muted)
    .then(member => message.channel.send(`${em.success} | **${member.user.tag}** has been unmuted!`))
    .catch(() => message.channel.send(`${em.error} | ${message.author}, I'm unable to unmute **${member.user.tag}**`));
  }
};
