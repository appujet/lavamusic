const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'queue',
  aliases: ["q"],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  inVoiceChannel: true,
  sameVoiceChannel: true,
  group: 'Music',
  description: '',
  examples: [''],
  parameters: [''],
  run: async (client, message, args) => {
        
        const { color } = client.config;
        const queue = message.client.distube.getQueue(message);

        if(!queue) {
            let embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`There is no music playing.`);
            return message.channel.send(embed);
        }

        // Queue status templat
      
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription('Current queue:\n' + queue.songs.map((song, id) => `**${id + 1}**. [${song.name}](${song.url}) - [${song.user}] \`${song.formattedDuration}\``).slice(0, 10).join("\n"))
            .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
        message.channel.send(embed);
    }
}