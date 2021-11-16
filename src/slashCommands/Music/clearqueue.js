const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "clearqueue",
    description: "Clear Queue",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
	
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
          ephemeral: false
        });
        const player = interaction.client.manager.get(interaction.guildId);              
       if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
             return interaction.editReply({embeds: [thing]});
        }
        
     		player.queue.clear();

		  const emojieject = client.emoji.remove;

		  let thing = new MessageEmbed()
	   		.setColor(client.embedColor)
  			.setTimestamp()
		  	.setDescription(`${emojieject} Removed all songs from the queue`)
         return interaction.editReply({embeds: [thing]});
	
    }
};