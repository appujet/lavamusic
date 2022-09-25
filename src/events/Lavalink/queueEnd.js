const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/setup");

module.exports = async (client, player) => {

	const invite = client.config.links.invite

	let guild = client.guilds.cache.get(player.guild);
	if (!guild) return;
	const data = await db.findOne({ Guild: guild.id });
	if (!data) return;
	let channel = guild.channels.cache.get(data.Channel);
	if (!channel) return;

	let message;

	try {

		message = await channel.messages.fetch({message: data.Message, cache: true });

	} catch (e) { };

	if (!message) return;
	await message.edit({ embeds: [new EmbedBuilder().setColor(client.embedColor).setTitle(`Nothing playing right now in this server!`).setDescription(`[Invite](${client.config.links.invite}) - [Support Server](${client.config.links.support})`).setImage(client.config.links.img)] }).catch(() => { });

	const emojiwarn = client.emoji.warn;
	let thing = new EmbedBuilder()
		.setColor(client.embedColor)
		.setAuthor({name: `Queue Concluded`, iconURL: client.user.displayAvatarURL() })
		.setDescription(`Enjoying music with me? Consider me by **Inviting**[Click Here](${invite})`)
	channel.send({ embeds: [thing] }).then(msg => { setTimeout(() => { msg.delete() }, 5000) });
	
    if (!player.twentyFourSeven) {
        
    
        await player.destroy();
      } else {
        
        await player.stop();
     }
}
