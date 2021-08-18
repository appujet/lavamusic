const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'pat',
  aliases: ['headpat'],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `pat` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user gave a headpat to the mentioned user 」. Use to indicate that you are / wanted to headpat the mentioned user (context may vary).',
  examples: [ 'pat @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))
    const { color } = client.config;
    const url = client.images.pat();
    const embed = new MessageEmbed()
    .setColor(color)
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      message.channel.send(embed.setDescription(`Here you go ${message.author}, \*pat* \*pat*`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription('UwU <3! Thanks!'));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`Here you go ${message.author}, \*pat* \*pat*`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} pats ${args[0]}!`)
      );

    };
  }
};
