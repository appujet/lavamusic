const {
  MessageEmbed,
  version,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const si = require("systeminformation");

module.exports = {
  name: "status",
  category: "Information",
  aliases: ["stats"],
  description: "Show status bot",
  args: false,
  usage: "",
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite")
        .setStyle("LINK")
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`
        ),

      new MessageButton()
        .setLabel("Support Server")
        .setStyle("LINK")
        .setURL("https://discord.gg/vfJRp2n3WW")
    );
    try {
      let totalSeconds = message.client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);

      let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s `;

      let connectedchannelsamount = 0;
      let guilds = client.guilds.cache.map((guild) => guild);
      for (let i = 0; i < guilds.length; i++) {
        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
      }
      if (connectedchannelsamount > client.guilds.cache.size)
        connectedchannelsamount = client.guilds.cache.size;

      const statsEmbed = new Discord.MessageEmbed()
        .setColor("#477dec")
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setDescription(
          `I'm a discord music bot with a wide variety of commands.`
        )
        .addFields(
          { name: `  **Birthday**`, value: `<t:1633112100>`, inline: true },
          { name: `  **Joined On**`, value: `<t:1634167015>`, inline: true },
          {
            name: `  **Developer(s)**`,
            value: `[ Abhijit#6892 ](https://discord.com/users/836958855866089512) & [ BrBlacky ](https://discord.com/users/491577179495333903)`,
            inline: false,
          },
          { name: `  **Platform**`, value: `\`[ ${os.type} ]\``, inline: true },
          {
            name: `  **Message Commands**`,
            value: `\`[ ${client.commands.size} ]\``,
            inline: true,
          },
          {
            name: `  **Slash Commands**`,
            value: `\`[ ${client.slashCommands.size} ]\``,
            inline: true,
          },
          {
            name: `  **Cached Server(s)**`,
            value: `\`[ ${client.guilds.cache.size} ]\``,
            inline: true,
          },
          {
            name: `  **Cached Channel(s)**`,
            value: `\`[ ${message.client.channels.cache.size} ]\``,
            inline: true,
          },
          {
            name: `  **Cached User(s)**`,
            value: `\`[ ${client.users.cache.size} ]\``,
            inline: true,
          },
          {
            name: `  **Total Users**`,
            value: `\`[ ${client.guilds.cache.reduce(
              (acc, guild) => acc + guild.memberCount,
              0
            )} ]\``,
            inline: true,
          },
          {
            name: `  **Total Player(s)**`,
            value: `\`[ ${connectedchannelsamount} ]\``,
            inline: true,
          },
          { name: `  **Uptime**`, value: `\`${uptime}\``, inline: true }
        );
      message.reply({ embeds: [statsEmbed], components: [row] });
    } catch (e) {
      console.log(String(e.stack).bgRed);
      const emesdf = new MessageEmbed()
        .setColor(`#477dec`)
        .setAuthor(`An Error Occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({ embeds: [emesdf] });
    }
  },
};
