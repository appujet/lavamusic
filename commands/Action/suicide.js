const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suicide',
  aliases: ['kms'],
  nsfw: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `suicide` to the chat. Usually interpreted as 「 The user who used this command wants to commit suicide (in a jokingly manner) 」. Use to indicate that you are stunned by the previous user\'s chats that it makes you want to kys. This is a roleplay command and is meant to be used as a joke, however, this will be limited to a nsfw channel due to sensitive nature of this command. Context should not include real crimes.',
  examples: [ 'suicide', 'kms' ],
  parameters: [],
  run: async ( client, message) => {
   const { color } = client.config;
    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} just committed a suicide. Horrible.`)
      .setColor(color)
      .setImage(client.images.suicide())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`)
    );
  }
};
