const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'smile',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Smiles at a user.',
  examples: [ 'smile @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))
    const { color } = client.config;
    const url = client.images.smile();
    const embed = new MessageEmbed()
    .setColor(color)
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} smiles!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} smiles back`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} smiles!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} smiles at ${args[0]}!`)
      );

    };
  }
};
