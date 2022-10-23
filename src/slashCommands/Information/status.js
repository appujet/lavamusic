const {
  version, EmbedBuilder
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");

module.exports = {
  name: "status",
  description: "Displays bot status.",
  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const duration1 = moment
      .duration(interaction.client.uptime)
      .format(" d [days], h [hrs], m [mins], s [secs]");
    const about = interaction.client.emoji.about;
    let guildsCounts = await client.guilds.fetch();
    let userCounts = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    const embed = new EmbedBuilder()
      .setColor(interaction.client.embedColor)
      .setThumbnail(interaction.client.user.displayAvatarURL())
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
    interaction.followUp({ embeds: [embed] });
  },
};
