const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'softmute',
  aliases: [ ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: 'Moderation',
  description: 'Toggle to prevent a user from sending a message in this channel',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'softmute @user',
    'softmute 728374657483920192'
  ],
  run: async (client, message, [member = '']) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    const muted = message.guild.roles.cache.get(muteID) || {};

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} Please provide the ID or mention the user to mute.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} | Unable to mute user: User not found.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} | ${message.author}, you cannot mute user whose roles are higher than yours!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`${em.error} | ${message.author}, no don't mute me!`);
    } else if (member.user.bot){
      return message.channel.send(`${em.error} | ${message.author}, you cannot mute bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`${em.error} | ${message.author}, you cannot mute yourself!`);
    } else if (member.roles.cache.has(muted.id)){
      return message.channel.send(`${em.error} | ${message.author}, **${member.user.tag}** is alredy muted server-wide!`);
    };

    return message.channel.updateOverwrite(member, {
      SEND_MESSAGES: !message.channel.permissionsFor(member).has('SEND_MESSAGES')
    }).then((ch) => message.channel.send(
      ch.permissionsFor(member).has('SEND_MESSAGES')
      ? `\\${em.success} | **${member.user.tag}** has been unmuted from this channel!`
      : `\\${em.success} | **${member.user.tag}** has been muted from this channel!`
    )).catch(() => message.channel.send(
      message.channel.permissionsFor(member).has('SEND_MESSAGES')
      ? `\\${em.error} | Unable to mute **${member.user.tag}** on this channel!`
      : `\\${em.error} | Unable to unmute **${member.user.tag}** on this channel!`
    ));
  }
};
