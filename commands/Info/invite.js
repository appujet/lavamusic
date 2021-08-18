const { MessageEmbed } = require("discord.js");
const { MessageButton } = require("discord-buttons");

module.exports = {
  name: 'invite',
  aliases: [],
  guildOnly: true,
  group: 'Info',
  description: 'Gives you the invite link',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'invite'
  ],
  run: async (client, message) => {
      const { color } = client.config;
      const FirstEmbed = new MessageEmbed()
        .setTitle(`${client.user.username}`)
        .setDescription(`Want to invite me to your server? than [click here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) to invite me to your server.`)
        .setColor(color)
        .setFooter(`Invite | \©️${new Date().getFullYear()} ${client.config.foot}`)
        .setTimestamp();

        const invite = new MessageButton()
        .setStyle(`url`)
        .setLabel(`Invite`)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)

        message.channel.send({ button: invite, embed: FirstEmbed })

    }
};