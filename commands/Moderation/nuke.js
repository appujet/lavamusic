const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'nuke',
  aliases: [ 'clearall' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'Moderation',
  description: 'Removes all messages in the channel (Deletes the old channel and makes a copy of it with permissions intact)',
  examples: [
    'nuke',
    'clearall'
  ],
  run: async (client, message) => {

    await message.channel.send(`This will remove all conversation in this channel and may cause conflict for bots using ID to track channels. Continue?`);

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`${em.error} | **${message.author.tag}**, you cancelled the nuke command!`);
    };

    return message.channel.send(`The nuke has been deployed, saying goodbye to **#${message.channel.name}** in 10`)
    .then(() => setTimeout(() => message.channel.clone()
    .then(() => message.channel.delete().catch(() => null)), 10000))
  }
};
