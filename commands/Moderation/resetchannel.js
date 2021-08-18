const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'resetchannel',
  aliases: [ 'resetch' ],
  guildOnly: true,
  permissions: [ 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'Moderation',
  description: `Removes all permission overwrites and resets @everyone permissions to \`unset\``,
  examples: [
    'resetchannel',
    'resetch'
  ],
  run: (client, message) => message.channel.overwritePermissions([
    { id: message.guild.roles.everyone.id }
  ])
  .then(ch => message.channel.send(`${em.success} Sucesssfully reset the permissions for this channel.`))
  .catch(() => message.channel.send(`${em.error} Unable to reset the permissions for this channel.`))
};
