const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'leave',
  aliases: ["dc"],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  inVoiceChannel: true,
  sameVoiceChannel: false,
  group: 'Music',
  description: 'Leave Voice Channel',
  examples: [''],
  parameters: ['Leave Your Voice Channel'],
  run: async (client, message, args) => {

        const { color } = client.config;
        const queue = message.client.distube.getQueue(message);

        if(!queue) {
            message.member.voice.channel.leave();
        } else {
	    message.client.distube.stop(message);
	    message.member.voice.channel.leave();
	}

        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription("**Leave** the voice channel.")
            .setFooter(`Music | \©️${new Date().getFullYear()} ${client.config.foot}`);
        return message.channel.send(embed);
    }
}