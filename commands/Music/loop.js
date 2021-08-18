const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'loop',
  aliases: ["repeat"],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  inVoiceChannel: true,
  sameVoiceChannel: true,
  group: 'Music',
  description: 'Reapeats the current song or playlist',
  examples: [''],
   run: async (client, message, args) => {
    
     const { color } = client.config;
     const queue = message.client.distube.getQueue(message);

        if(!queue) {
            let thing = new MessageEmbed()
                .setColor(color)
                .setDescription(`There is no music playing.`);
            return message.channel.send(thing);
        }

        let mode = message.client.distube.setRepeatMode(message, parseInt(args[0]));
        mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";

        // Queue status template
      
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription("Set repeat mode to **" + mode + "**")
            .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
        message.channel.send(embed);
    }
}