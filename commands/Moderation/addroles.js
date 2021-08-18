const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'addroles',
  aliases: [ 'role' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  clientPermissions: [ 'MANAGE_ROLES' ],
  group: 'Moderation',
  description: 'Adds the mentioned roles and/or supplied role IDs to the mentioned user',
  examples: [
    'addroles @user @role1 @role2 @role3',
    'addrole @user @role'
  ],
  run: async (client, message, [member = '', ...rawRoles] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please supply the ID or mention the member you want roles be added to.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} | ${message.author}, Couldn't find the supplied member on this server`)
    };

    if (!rawRoles.length){
      return message.channel.send(`${em.error} | ${message.author}, Please supply the ID or mention the roles you want to add to this member`);
    };

    const roles = [...new Set([...rawRoles
    .filter(r => r.match(/\d{17,19}/))
    .filter(r => message.guild.roles.cache.has(r.match(/\d{17,19}/)))
    .filter(r => !message.member.roles.cache.has(r.match(/\d{17,19}/)))
    .map(r => r.match(/\d{17,19}/)[0])])];

    if (!roles.length){
      return message.channel.send(`${em.error} | ${message.author}, either **${member.user.tag}** already had those roles, or none of the supplied role IDs were valid.`);
    };

    return member.roles.add(roles)
    .then(_member => message.channel.send(`${em.success} | Succesfully added **${roles.length}** roles to **${_member.user.tag}**!`))
    .catch(() => message.channel.send(`Unable to add roles to **${member.user.tag}**`));
  }
};
