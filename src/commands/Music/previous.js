const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "previous",
	aliases: [],
	category: "Music",
	description: "Go Back to Previous Played Song",
	args: false,
    usage: "Plays Previous Song",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
execute: async (message, client, prefix) => {
  
		const player = message.client.manager.get(message.guild.id);

        if (!player)
        return message.reply("There is no player for this Guild")

        const pre = player.queue.previous;
	    const curr = player.queue.current;
	    const next = player.queue[0]

        if (!pre
            || pre === curr
            || pre === next){
            const wow = new EmbedBuilder()
                .setColor("Red")
                .setDescription("There is no previous song in the queue.")
                .setTimestamp()
                return message.reply({embeds: [wow]}).then(msg => { setTimeout(() => {msg.delete()}, 5000);
            })   
            }
    

        if (pre !== curr && pre !== next) {
            player.queue.splice(0, 0, curr)
            player.play(pre);
            }{
                const wow2 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Playing Previous Song **${pre.title}**`)
                .setTimestamp()
                return message.reply({embeds: [wow2]}).then(msg => { setTimeout(() => {msg.delete()}, 9000);
            })   
            }
	
    }
};
