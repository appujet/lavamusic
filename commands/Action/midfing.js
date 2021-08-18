const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'midfing',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'Action',
  nsfw: true,
  description: 'Sends a roleplay gif `midfing` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user who used this command wants the mentioned user to **** off 」. Use to indicate that you are annoyed by the user (context may vary). This is a roleplay command and is meant to be used as a joke, however, this will be limited to a nsfw channel due to sensitive nature of this command.',
  examples: [ 'midfing @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const midfing = client.images.midfing();
    const baka = client.images.baka();
    const { color } = client.config;
    const embed = new MessageEmbed()
    .setColor(color)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} ${client.config.foot}`);

    if (!message.mentions.members.size){

      message.channel.send(embed.setImage(midfing));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(baka).setDescription(message.author.toString()));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(midfing));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member.displayName}: "Hey ${args[0]}!"`)
      );

    };
  }
};
