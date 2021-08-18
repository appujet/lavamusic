const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'lockdown',
  aliases: [ 'lock', 'ld', 'lockchannel' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'Moderation',
  description: `[Prevent/Allow] users from sending messages in the current channel. Permission Overwrites will be lost.`,
  examples: [
    'lockdown',
    'lock',
    'ld',
    'lockchannel'
  ],
  run: (client, message) => message.channel.overwritePermissions([
    {
      id: message.guild.roles.everyone.id,
      deny: [ 'SEND_MESSAGES' ].slice(Number(
        !message.channel.permissionsFor(message.guild.roles.everyone)
        .has('SEND_MESSAGES'))),
      allow: [ 'SEND_MESSAGES' ].slice(Number(
        message.channel.permissionsFor(message.guild.roles.everyone)
        .has('SEND_MESSAGES')))
    },
    {
      id: message.guild.me.id,
      allow: [ 'SEND_MESSAGES' ]
    }
  ], `Alina Lockdown Command: ${message.author.tag}`)
  .then((ch) => message.channel.send(
    ch.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? `${em.success} Lockdown Ended! Everyone can now send messages on this channel`
    : `${em.success} Lockdown has initiated! Users withour special permissions will not be able to send messages here!`
  )).catch(() => message.channel.send(
    message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? `${em.error} Unable to Lockdown this channel!`
    : `${em.error} Unable to restore this channel!`
  ))
};
