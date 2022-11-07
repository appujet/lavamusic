const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "create",
    aliases: ["plcreate"],
    category: "Playlist",
    description: "Creates the user's playlist.",
    args: true,
    usage: "<playlist name>",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        var color = client.embedColor;
        const Name = args[0].replace(/_/g, ' ');
        if (Name[0].length < 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription("Provide a playlist name.")] });
        };

        if (Name.length > 100) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription("Playlist name can't be greater than \`100\` characters.")] });
        };
        let data = await db.find({
            UserId: message.author.id,
            PlaylistName: Name,
        });

        if (data.length > 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`This playlist already exists! Delete it using: ${prefix}delete **${Name}**.`)] })
        };
        let userData = db.find({
            UserId: message.author.id
        });
        if (userData.length >= 10) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`You can only create up to \`10\` playlists.`)] })
        }

        const newData = new db({
            UserName: message.author.tag,
            UserId: message.author.id,
            PlaylistName: Name,
            CreatedOn: Math.round(Date.now() / 1000)
        });
        await newData.save();
        const embed = new EmbedBuilder()
            .setDescription(`Successfully created a playlist for you **${Name}**.`)
            .setColor(color)
        return message.channel.send({ embeds: [embed] })

    }
};
