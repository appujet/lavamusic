const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "remove",
    category: "Music",
	description: "Remove song from the queue",
	args: false,
    usage: "<Number of song in queue>",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
	 execute: async (message, args, client, prefix) => {
  
		const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const position = (Number(args[0]) - 1);
        if (position > player.queue.size) {
            const number = (position + 1);
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return message.channel.send({embeds: [thing]});
        }

		const song = player.queue.remove(position);

		const emojieject = message.client.emoji.remove;

		let thing = new MessageEmbed()
			.setColor(message.client.embedColor)
			.setTimestamp()
			.setDescription(`${emojieject} Removed\n[${song.track.title}](${song.track.uri})`)
		  return message.channel.send({embeds: [thing]});
	
    }
};