const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "autoplay",
    description: "Toggle music autoplay",
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
       	if (!player) {
	      const embed = new MessageEmbed()
	      	.setDescription('there is nothing playing')
	      	.setColor(client.embedColor)
	     return interaction.editReply({embeds: [thing]});
        }
        const autoplay = player.get("autoplay");

        const emojireplay = client.emoji.autoplay;

        if (autoplay === false) {
            const identifier = player.queue.current.identifier;
            player.set("autoplay", true);
            player.set("requester", interaction.author);
            player.set("identifier", identifier);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            res = await player.search(search, interaction.author);
            player.queue.add(res.tracks[1]);
            let thing = new MessageEmbed()
                .setColor(client.embedColor)
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **enabled**`)
      return interaction.editReply({embeds: [thing]});
    } else {
			player.set("autoplay", false);
      player.queue.clear();
    let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **disabled**`)
       return interaction.editReply({embeds: [thing]});
	
     }
  
   }
				 }