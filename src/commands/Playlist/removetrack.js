const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "removetrack",
    aliases: ["plremovet"],
    category: "Playlist",
    description: "Remove a track from your saved playlist.",
    args: true,
    usage: "<playlist name> <track number>",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {
        var color = client.embedColor;

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        const Options = args[1];
        if (!Options || isNaN(Options)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`You didn't enter a valid track number (ID of track to remove)\nTo see all your tracks: ${prefix}info ${Name}`)] });
        }
        let tracks = data.Playlist;
        if (Number(Options) >= tracks.length || Number(Options) < 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(`Your provided track number is out of range (\`0\` - ${tracks.length - 1})\nTo see all your tracks: \`${prefix}info\` showdetails ${Name}`)] });

        }
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $pull: {
                    Playlist: data.Playlist[Options]
                }
            });
            const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`Removed **${tracks[Options].title}** from \`${Name}\``);
            return message.channel.send({embeds: [embed]});
    }
};
