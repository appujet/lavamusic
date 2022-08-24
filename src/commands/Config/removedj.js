const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "removedj",
    category: "Config",
    description: "Removes the DJ role.",
    args: false,
    usage: "",
    aliases: ["romdj", "rdj", "rmdj"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        if (data) {
            await data.delete()
            return message.reply({ embeds: [new EmbedBuilder().setDescription(`Successfully removed all DJ roles.`).setColor(client.embedColor)] })
        } else return message.reply({ embeds: [new EmbedBuilder().setDescription(`You don't have any DJ roles setup in this guild!`).setColor(client.embedColor)] })

    }
}
