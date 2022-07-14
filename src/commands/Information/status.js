const { EmbedBuilder, version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');

module.exports = {
    name: "status",
    category: "Information",
    aliases: ["stats"],
    description: "Show status bot",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
        const duration1 = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const cpu = await si.cpu();
        const about = message.client.emoji.about;
        let ccount = client.channels.cache.size;
        let scount = client.guilds.cache.size;
        const memberCount = client.guilds.cache.reduce((acc, curr) => acc + curr.memberCount, 0);
        
        const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setDescription(`${about} **Status**
**= STATISTICS =**
**• Servers** : ${scount}
**• Channels** : ${ccount}
**• Users** : ${memberCount}
**• Discord.js** : v${version}
**• Node** : ${process.version}
**= SYSTEM =**
**• Platfrom** : ${os.type}
**• Uptime** : ${duration1}
**• CPU** :
> **• Cores** : ${cpu.cores}
> **• Model** : ${os.cpus()[0].model} 
> **• Speed** : ${os.cpus()[0].speed} MHz
**• MEMORY** :
> **• Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps
> **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(2)} Mbps
> **• Heap Total** : ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps
> **• Heap Usage** : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps
`);
        message.reply({ embeds: [embed] });
    }
}
