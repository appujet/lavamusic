const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'hug',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  description: 'Sends a roleplay gif `hug` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been hugged 」. Use to indicate that you are / wanted to hug the mentioned user (context may vary). May be used in a similar context to the emoji 🤗.',
  examples: [ 'hug @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))
    const { color } = client.config;
    const url = client.images.hug();
    const embed = new MessageEmbed()
    .setColor(color)
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} H~here! Thought you needed a hug!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} H~how thoughtful! Thank you! ʸᵒᵘ'ʳᵉ ⁿᵒᵗ ˢᵃᵏᵘᵗᵃ ᵗʰᵒ`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} H~here! Thought you needed a hug!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} was being hugged by ${message.author}!`)
      );

    };
  }
};
