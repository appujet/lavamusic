const { MessageEmbed } = require("discord.js");
module.exports = {
	name: "247",
    aliases: ["24h", "24/7", "24*7"],
    category: "Music",
    description: "24/7 in voice channel",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
	 execute: async (message, args, client, prefix) => {
    
  const player = message.client.manager.players.get(message.guild.id);
		if (!player) {
	const embed = new MessageEmbed()
		.setDescription('there is nothing playing')
		.setColor(client.embedColor)
		return message.channel.send({embeds: [embed]})
  const { channel } = message.member.voice

		if (player.twentyFourSeven) {
			player.twentyFourSeven = false;
			 const embed = new MessageEmbed()
        .setDescription("24/7 mode is **disabled**")
        .setColor(client.embedColor)
			return message.channel.send({embeds: [embed]})
		} else {
			player.twentyFourSeven = true;
		 const embed = new MessageEmbed()
        .setDescription("24/7 mode is **Enable**")
        .setColor(client.embedColor)
			return message.channel.send({embeds: [embed]})
		  
		}

  }
}
}