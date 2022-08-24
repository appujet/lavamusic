const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "volume",
    aliases: ["v", "vol"],
    category: "Music",
    description: "Change the volume of the bot.",
    args: false,
    usage: "",
    userPerms: [],
	dj: true,
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
execute: async (message, args, client, prefix) => {
  
	const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [thing]});
		}
		
		const volumeEmoji = client.emoji.volumehigh;

		if (!args.length) {
			let thing = new EmbedBuilder()
			.setColor(client.embedColor)
			.setTimestamp()
			.setDescription(`${volumeEmoji} The current volume is: **${player.volume}%**`)
			return message.reply({embeds: [thing]});
		}

		const volume = Number(args[0]);
		
		if (!volume || volume < 0 || volume > 100) { 
			let thing = new EmbedBuilder()
                .setColor("Red")
				.setDescription(`Usage: ${prefix}volume <0 - 100>`)
            return message.reply({embeds: [thing]});
		}

		player.setVolume(volume);

		if (volume > player.volume) {
			var emojivolume = client.emoji.volumehigh;
			let thing = new EmbedBuilder()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [thing]});
		} else if (volume < player.volume) {
			var emojivolume = message.client.emoji.volumelow;
			let thing = new EmbedBuilder()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [thing]});
		} else {
			let thing = new EmbedBuilder()
				.setColor(client.embedColor)
				.setTimestamp()
				.setDescription(`${volumeEmoji} Volume set to: **${volume}%**`)
			return message.reply({embeds: [thing]});
		}
		
 	}
};
