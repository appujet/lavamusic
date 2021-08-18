const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'cry',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `cry` to the chat. Usually interpreted as 「 The user who used this commnd is crying 」. Use to indicate that you are currently crying. May be used in a similar context to the emoji 😢.',
  examples: [ 'cry' ],
  parameters: [],
  run: async ( client, message ) => {
   const { color } = client.config;
    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setDescription(`${message.author} started crying!`)
      .setImage(client.images.cry())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
