const { MessageEmbed } = require("discord.js");

module.exports = {
	  name: "volume",
	  aliases: ["v", "vol"],
	  category: "Music",
  	description: "Change volume of currently playing music",
	  args: false,
    usage: "",
    permission: [],
    owner: false,
  	player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
	execute: async (message, args, client, prefix) => {
  
		const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [thing]});
		}
		
		const volumeEmoji = client.emoji.volumehigh;

		if (!args.length) {
			let thing = new MessageEmbed()
			.setColor(client.embedColor)
			.setTimestamp()
			.setDescription(`${volumeEmoji} The current volume is: **${player.volume}%**`)
			return message.reply({embeds: [thing]});
		}

		const volume = Number(args[0]);
		
		if (!volume || volume < 0 || volume > 100) { 
			let thing = new MessageEmbed()
                .setColor("RED")
				.setDescription(`Usage: ${prefix}volume <Number of volume between 0 - 100>`)
            return message.reply({embeds: [thing]});
		}

		player.setVolume(volume);

		if (volume > player.volume) {
			var emojivolume = client.emoji.volumehigh;
			let thing = new MessageEmbed()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [thing]});
		} else if (volume < player.volume) {
			var emojivolume = message.client.emoji.volumelow;
			let thing = new MessageEmbed()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [thing]});
		} else {
			let thing = new MessageEmbed()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${volumeEmoji} Volume set to: **${volume}%**`)
			return message.reply({embeds: [thing]});
		}
		
 	}
};