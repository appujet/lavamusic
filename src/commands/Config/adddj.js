const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "adddj",
    category: "Config",
    description: "Sets the DJ role.",
    args: false,
    usage: "",
    aliases: ["adj"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply({ embeds: [new EmbedBuilder().setDescription(`Please ping the role to add, @role!`).setColor(client.embedColor)] })
        if (!data) {
           data = new db({
                Guild: message.guild.id,
                Roles: [role.id],
                Mode: true
            })
            await data.save();
            return await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Successfully added DJ role ${role}.`).setColor(client.embedColor)] })
        } else {
            let rolecheck = data.Roles.find((x) => x === role.id);
            if (rolecheck) return message.reply({ embeds: [new EmbedBuilder().setDescription(`Role already exists in the list.`).setColor(client.embedColor)] })
            data.Roles.push(role.id);
            await data.save();
            return await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`Successfully added the new DJ role ${role}.`).setColor(client.embedColor)] })

        }
    }
}
