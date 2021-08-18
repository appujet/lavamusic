const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'happy',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `happy` to the chat. Usually interpreted as 「 The user who used this command is happy (shiawase da!!) 」. Use to indicate that you are currently happy (context may vary). May be used in a similar context to the emoji 😃.',
  examples: [ 'happy' ],
  parameters: [],
  run: async ( client, message ) => {
   const { color } = client.config;
    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} is happy.`)
      .setColor(color)
      .setImage(client.images.happy())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
