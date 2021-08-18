const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'dance',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `dance` to the chat. Usually interpreted as 「 The user who used this commnd is dancing (in joy) 」. Use to indicate that you are currently dancing (context may vary).',
  examples: [ 'dance' ],
  parameters: [],
  run: async ( client, message ) => {
   const { color } = client.config;
    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setDescription(`${message.author} started dancing!`)
      .setImage(client.images.dance())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
}
