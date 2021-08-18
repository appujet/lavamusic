const em = require('../../assets/json/emojis.json');
module.exports = {
	name: 'softban',
	aliases: [],
	guildOnly: true,
	permissions: ['BAN_MEMBERS'],
	clientPermissions: ['BAN_MEMBERS'],
	group: 'Moderation',
	description: 'Kicks a user and deletes all their messages in the past 7 days',
	parameters: ['user Mention/ID'],
	examples: ['softban @user', 'softban 7283746574829102938'],
	run: async (client, message, [member = '']) => {
		if (!member.match(/\d{17,19}/)) {
			return message.channel.send(
				`${em.error} | ${
					message.author
				}, Please profilde the ID or mention the user to softban.`
			);
		}

		member = await message.guild.members
			.fetch(member.match(/\d{17,19}/)[0])
			.catch(() => null);

		if (!member) {
			return message.channel.send(
				`${em.error} | ${
					message.author
				}, User could not be found! Please ensure the supplied ID is valid.`
			);
		} else if (member.id === message.author.id) {
			return message.channel.send(
				`${em.error} | ${message.author}, You cannot softban yourself!`
			);
		} else if (member.id === client.user.id) {
			return message.channel.send(
				`${em.error} | ${message.author}, Please don't softban me!`
			);
		} else if (member.id === message.guild.ownerID) {
			return message.channel.send(
				`${em.error} | ${message.author}, You cannot softban a server owner!`
			);
		} else if (client.config.owners.includes(member.id)) {
			return message.channel.send(
				`${em.error} | ${
					message.author
				}, No, you can't softban my developers through me!`
			);
		} else if (
			message.member.roles.highest.position < member.roles.highest.position
		) {
			return message.channel.send(
				`${em.error} | ${
					message.author
				}, You can't softban that user! He/She has a higher role than yours`
			);
		} else if (!member.bannable) {
			return message.channel.send(
				`${em.error} | ${message.author}, I couldn't softban that user!`
			);
		}

		return message.guild.members
			.ban(member, { reason: `ALINA_SOFTBANS: ${message.author.tag}`, days: 7 })
			.then(() =>
				message.guild.members.unban(member, {
					reason: `ALINA_SOFTBANS: ${message.author.tag}`
				})
			)
			.then(() =>
				message.channel.send(
					`${em.success} | Successfully Softbanned **${member.user.tag}**`
				)
			)
			.catch(() =>
				message.channel.send(
					`${em.error} | ${message.author}, Unable to softban **${member.user.tag}**!`
				)
			);
	}
};
