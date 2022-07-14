const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "removedj",
    category: "Config",
    description: "Remove Dj Role",
    args: false,
    usage: "",
    aliases: ["romdj"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        if (data) {
            await data.delete()
            return message.reply({ embeds: [new EmbedBuilder().setDescription(`Successfully removed all DJ Roles.`).setColor(client.embedColor)] })
        } else return message.reply({ embeds: [new EmbedBuilder().setDescription(`You don't have any DJ setup in this Guild!`).setColor(client.embedColor)] })

    }
}
