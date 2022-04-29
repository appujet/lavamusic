const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "toggledj",
    category: "Config",
    description: " Toggle Dj mode",
    args: false,
    usage: "",
    aliases: ["romdj"],
    permission: ['MANAGE_GUILD'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });

        if(!data) return message.reply({embeds:[new MessageEmbed().setDescription(`Don't Have Dj Setup In This Guild`).setColor(client.embedColor)]})

        let mode = false;
        if(!data.Mode)mode = true;
        data.Mode = mode;
        await data.save();
        if(mode) {
            await message.reply({embeds: [new MessageEmbed().setDescription(`Enabled DJ Mode.`).setColor(client.embedColor)]})
        } else {
           return await message.reply({embeds: [new MessageEmbed().setDescription(`Disabled DJ Mode.`).setColor(client.embedColor)]})
        }
    }
}