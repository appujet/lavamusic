const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const db = require("../../schema/setup");

module.exports = async (client, player) => {

	client.logger.log(`Player has been destroyed in ${player.guild}`, "log");

	let guild = client.guilds.cache.get(player.guild);
	if (!guild) return;
	const data = await db.findOne({ Guild: guild.id });
	if (!data) return;

	let channel = guild.channels.cache.get(data.Channel);
	if (!channel) return;

	let message;

	try {

		message = await channel.messages.fetch({ message: data.Message, cache: true });

	} catch (e) { };

	if (!message) return;
	let disabled = true;
        if(player && player.queue && player.queue.current) disabled = false;
		
	let embed1 = new EmbedBuilder().setColor(client.embedColor).setTitle(`Nothing playing right now in this server!`).setDescription(`[Invite](${client.config.links.invite}) - [Support Server](${client.config.links.support})`).setImage(client.config.links.img);

	let pausebut = new ButtonBuilder().setCustomId(`pause_but_${guild.id}`).setEmoji({ name: "⏯️" }).setStyle(ButtonStyle.Secondary).setDisabled(false);

	let lowvolumebut = new ButtonBuilder().setCustomId(`lowvolume_but_${guild.id}`).setEmoji({ name: "🔉" }).setStyle(ButtonStyle.Secondary).setDisabled(false);

	let highvolumebut = new ButtonBuilder().setCustomId(`highvolume_but_${guild.id}`).setEmoji({ name: "🔊" }).setStyle(ButtonStyle.Secondary).setDisabled(false);

	let previousbut = new ButtonBuilder().setCustomId(`previous_but_${guild.id}`).setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Secondary).setDisabled(false);

	let skipbut = new ButtonBuilder().setCustomId(`skipbut_but_${guild.id}`).setEmoji({ name: "⏭️" }).setStyle(ButtonStyle.Secondary).setDisabled(false);

	const row1 = new ActionRowBuilder().addComponents([lowvolumebut, previousbut, pausebut, skipbut, highvolumebut]);
	await message.edit({
		content: "__**Join a voice channel and queue songs by name/url**__\n\n",
		embeds: [embed1],
		components: [row1]
	});

}
