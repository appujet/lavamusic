const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "removedj",
    category: "Config",
    description: "Remove Dj Role",
    args: false,
    usage: "",
    aliases: ["romdj"],
    permission: ['MANAGE_GUILD'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        if (data) {
            await data.delete()
            return message.reply({ embeds: [new MessageEmbed().setDescription(`Successfully Removed All DJ Roles.`).setColor(client.embedColor)] })
        } else return message.reply({ embeds: [new MessageEmbed().setDescription(`Don't Have Dj Setup In This Guild`).setColor(client.embedColor)] })

    }
}
