const delay = require("delay");
const { MessageEmbed } = require("discord.js");
const ms = require('ms');
const i18n = require("../../utils/i18n");

module.exports = async (client, player) => {

	const channel = client.channels.cache.get(player.textChannel);
	const emojiwarn = client.emoji.warn;
	let thing = new MessageEmbed()
		.setColor(client.embedColor)
		.setDescription(`${emojiwarn} ${i18n.__("player.track.end")}`)
		.setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()});
	channel.send({embeds: [thing] });
}