const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "adddj",
    category: "Config",
    description: "Set Dj Role",
    args: false,
    usage: "",
    aliases: ["adj"],
    permission: ['MANAGE_GUILD'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply({ embeds: [new MessageEmbed().setDescription(`Please add a Role via ping, @role!`).setColor(client.embedColor)] })
        if (!data) {
           data = new db({
                Guild: message.guild.id,
                Roles: [role.id],
                Mode: true
            })
            await data.save();
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(`Successfully Added DJ Role ${role}.`).setColor(client.embedColor)] })
        } else {
            let rolecheck = data.Roles.find((x) => x === role.id);
            if (rolecheck) return message.reply({ embeds: [new MessageEmbed().setDescription(`Role Already Exists in List.`).setColor(client.embedColor)] })
            data.Roles.push(role.id);
            await data.save();
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(`Successfully Added New DJ Role ${role}.`).setColor(client.embedColor)] })

        }
    }
}