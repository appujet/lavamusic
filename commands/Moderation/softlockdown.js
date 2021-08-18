const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'softlockdown',
  aliases: [ 'softlock', 'softld', 'softlockchannel' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'Moderation',
  description: `[Prevent/Allow] users without special permissions from sending messages in the current channel. Permission Overwrites will be kept.`,
  examples: [
    'softlockdown',
    'softlock'
  ],
  run: (client, message) => message.channel.updateOverwrite(
    message.guild.roles.everyone,
    {
      SEND_MESSAGES: !message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    },
    `Alina Soft-Lockdown Command: ${message.author.tag}`)
  .then((ch) => message.channel.updateOverwrite(client.user, { SEND_MESSAGES: true }))
  .then((ch) => message.channel.send(
    ch.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? `${em.success} Lockdown Ended! Everyone can now send messages on this channel`
    : `${em.success} Lockdown has initiated! Users without roles or special permissions will not be able to send messages here!`
  )).catch(() => message.channel.send(
    message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? `${em.error} | Unable to Soft-lockdown this channel!`
    : `${em.error} | Unable to restore this channel!`
  ))
};
