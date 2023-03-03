const { EmbedBuilder, version, Message } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const MusicBot = require("../../structures/Client");

module.exports = {
  name: "status",
  category: "Information",
  aliases: ["stats"],
  description: "Displays bot status.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {string[]} args
   * @param {MusicBot} client
   * @param {string} prefix
   */
  execute: async (message, args, client, prefix) => {
    const duration1 = moment
      .duration(message.client.uptime)
      .format(" d [days], h [hrs], m [mins], s [secs]");
    const about = message.client.emoji.about;
    let guildsCounts = await client.guilds.fetch();
    let userCounts = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter({ text: `You are in shard [${client.shard.ids[0]}]` })
      .setDescription(`${about} **Status**
                **= STATISTICS =**
                **• Servers** : ${guildsCounts.size}
                **• Users** : ${userCounts}
                **• Discord.js** : v${version}
                **• Node** : ${process.version}
                **= SYSTEM =**
                **• Platfrom** : ${os.type}
                **• Uptime** : ${duration1}
                **• CPU** :
                > **• Cores** : ${os.cpus().length}
                > **• Model** : ${os.cpus()[0].model} 
                > **• Speed** : ${os.cpus()[0].speed} MHz
                **• MEMORY** :
                > **• Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(
        2
      )}mb
                > **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(
        2
      )}mb
                > **• Heap Total** : ${(
          process.memoryUsage().heapTotal /
          1024 /
          1024
        ).toFixed(2)}mb
                > **• Heap Usage** : ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)}mb
            `);
    message.reply({ embeds: [embed] });
  },
};
