const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'respect',
  aliases: [ 'f', 'rp', '+rp' ],
  group: 'Fun',
  description: 'Show thy respect. Accepts arguments.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'respect',
    'f Kyoto Animation',
    'rp @user',
  ],
  run: async (client, message, args) => {

    const { color } = client.config;
    const rep = await message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setFooter(`Press F to pay respect | \©️${new Date().getFullYear()}${client.config.foot}`)
      .setDescription(`${message.member} has paid their respect${args.length ? ` to ${args.join(' ')}.` : ''}`)
    );

    await message.delete().catch(() => null);

    return rep.react("🇫")
  }
};
