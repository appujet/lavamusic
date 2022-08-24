const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "toggledj",
    category: "Config",
    description: "Toggles DJ mode.",
    args: false,
    usage: "",
    aliases: ["djoff", "djon"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });

        if(!data) return message.reply({embeds:[new EmbedBuilder().setDescription(`You don't have a DJ role setup in this guild!`).setColor(client.embedColor)]})

        let mode = false;
        if(!data.Mode)mode = true;
        data.Mode = mode;
        await data.save();
        if(mode) {
            await message.reply({embeds: [new EmbedBuilder().setDescription(`Enabled DJ mode.`).setColor(client.embedColor)]})
        } else {
           return await message.reply({embeds: [new EmbedBuilder().setDescription(`Disabled DJ mode.`).setColor(client.embedColor)]})
        }
    }
}