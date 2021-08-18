const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'unban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: 'Moderation',
  description: 'Unbans a user from this server',
  parameters: [ 'user Mention/ID', 'Unban Reason' ],
  examples: [
    'unban 728374657483920192',
  ],
  run: async (client, message, [ user = '', ...args ]) => {

    if (!user.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the ID of the user to unban`);
    };

    user = user.match(/\d{17,19}/)[0];

    return message.guild.members.unban(user, { reason: `ALi Unbans: ${message.author.tag}: ${args.join(' ') || 'None'}`})
    .then(user => message.channel.send(`${em.success} | Successfully unbanned **${user.tag}**!`))
    .catch(() => message.channel.send(`${em.error} | Unable to unban user with ID ${user}. The provided argument maybe not a valid user id, or the user is not banned.`));
  }
};
