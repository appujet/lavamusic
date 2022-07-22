const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "skipto",
    aliases: ["jump"],
    category: "Music",
    description: "Forward song",
    args: true,
    usage: "<Number of song in queue>",
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

        const position = Number(args[0]);
		
		if (!position || position < 0 || position > player.queue.size) { 
			let thing = new EmbedBuilder()
                .setColor("Red")
				.setDescription(`Usage: ${message.client.prefix}skipto <Number of song in queue>`)
            return message.reply({embeds: [thing]});
		}

        player.queue.remove(0, position);
        player.stop();
		
		const emojijump = client.emoji.jump;

		let thing = new EmbedBuilder()
			.setDescription(`${emojijump} Forward **${position}** Songs`)
			.setColor(client.embedColor)
			.setTimestamp()
			
		return message.reply({embeds: [thing]});
	
    }
};
