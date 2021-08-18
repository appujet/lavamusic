const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'resetroles',
  aliases: [ 'resetrole', 'removeroles', 'removerole', 'purgerole' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  clientPermissions: [ 'MANAGE_ROLES' ],
  group: 'Moderation',
  description: 'Removes **all** custom roles from a user. (@everyone will be excluded)',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'resetroles @user',
    'resetrole 7283746571920016374'
  ],
  run: async (client, message, [member = '']) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the ID or mention the user to kick. [mention first before adding the reason]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} Unable to reset roles of the user: User not found.`);
    } else if (member.id === client.user.id){
      return message.channel.send(`${em.error} ${message.author}, I do not recommend resetting my roles!`);
    } else if (member.user.bot){
      return message.channel.send(`${em.error} ${message.author}, I do not recommend resetting bot roles! (Might affect role integration)`);
    } else if (message.member.id === member.id){
      return message.channel.send(`${em.error} ${message.author}, You cannot reset your own roles!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} ${message.author}, You cannot modify roles of user who has of higher permission than yours!`);
    } else if (!Boolean(member.roles.cache.size - 1)){
      return message.channel.send(`${em.error} ${message.author}, **${member.user.tag}** has no roles to remove from.`);
    };

    await message.channel.send(`This will remove all of **${member.user.tag}**'s roles, including special roles like mute role. Continue?`);

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`${em.error} | **${message.author.tag}**, you cancelled the resetrole command!`);
    };

    const prevRoleCount = member.roles.cache.size - 1;
    return member.roles.set([])
    .then(member => message.channel.send(`${em.success} | Successfully removed **${prevRoleCount}** roles from **${member.user.tag}**!`))
    .catch(() => message.channel.send(`${em.error} Unable to remove all of **${member.user.tag}**'s roles!`))
  }
};
