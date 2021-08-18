const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'addemoji',
  aliases: [],
  guildOnly: true,
  permissions: [ 'MANAGE_EMOJIS' ],
  clientPermissions: [ 'MANAGE_EMOJIS' ],
  group: 'Moderation',
  description: 'Add an emoji to the server using the supplied image URL and name (optional)',
  parameters: [ 'Image URL', 'Emoji Name' ],
  examples: [
    'addemoji https://some-url/path-to-image.format emojiname'
  ],
  run: (client, message, [url, name] ) => {

    if (!url || !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url)){
      return message.channel.send(`${em.error} | ${message.author}, please provide a valid image link!`);
    };

    return message.guild.emojis.create(url, name || 'emoji')
    .then(emoji => message.channel.send(`${em.success} | Successfully created emoji **${emoji.name}** | ${emoji}`))
    .catch(err => message.channel.send(`${em.error} | ${message.author}, ${err.message.replace(`Invalid Form Body\nimage:`,'')}.`));
  }
};
