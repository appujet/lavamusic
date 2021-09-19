const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "skipto",
    description: "Forward song",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
      {
        name: "number",
        description: "select a song number",
        required: true,
        type: "NUMBER"
		}
	],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix ) => {
        await interaction.deferReply({
          ephemeral: false
        });
      const args = interaction.options.getNumber("number");
    	const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
           return await interaction.editReply({embeds: [thing]});
        }

        const position = Number(args);
		
		if (!position || position < 0 || position > player.queue.size) { 
			let thing = new MessageEmbed()
        .setColor("RED")
				.setDescription(`Usage: ${prefix}volume <Number of song in queue>`)
            return await interaction.editReply({embeds: [thing]});
		}

        player.queue.remove(0, position - 1);
        player.stop();
		
		const emojijump = client.emoji.jump;

		let thing = new MessageEmbed()
			.setDescription(`${emojijump} Forward **${position}** Songs`)
			.setColor(client.embedColor)
			.setTimestamp()
			
		return await interaction.editReply({embeds: [thing]});
	
    }
};