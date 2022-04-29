const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const db = require("../../schema/playlist");
const { convertTime } = require("../../utils/convert.js");
const lodash = require("lodash");

module.exports = {
    name: "info",
    aliases: ["plinfo"],
    category: "Playlist",
    description: "Get information about your saved playlist.",
    args: false,
    usage: "<playlist name>",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        let tracks = data.Playlist.map((x, i) => `\`${+i}\` - ${x.title && x.uri ? `[${x.title}](${x.uri})` : `${x.title}`}${x.duration ? ` - \`${convertTime(Number(x.duration))}\`` : ""}`);
        const pages = lodash.chunk(tracks, 10).map((x) => x.join("\n"));
        let page = 0;
        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s Playlists`)
            .setColor(client.embedColor)
            .setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`)
        if (pages.length <= 1) {
            return await message.reply({ embeds: [embed] })
        } else {

            let previousbut = new MessageButton().setCustomId("Previous").setEmoji("⏪").setStyle("SECONDARY");

            let nextbut = new MessageButton().setCustomId("Next").setEmoji("⏩").setStyle("SECONDARY");

            let stopbut = new MessageButton().setCustomId("stop").setEmoji("⏹️").setStyle("SECONDARY");

            const row = new MessageActionRow().addComponents(previousbut, stopbut, nextbut);

            const m = await message.reply({ embeds: [embed], components: [row] });

            const collector = m.createMessageComponentCollector({
                filter: (b) => b.user.id === message.author.id ? true : false && b.deferUpdate().catch(() => { }),
                time: 60000 * 5,
                idle: 60000 * 5 / 2
            });
            let pname = data.PlaylistName;
            let plist = data.Playlist.length;


            collector.on("end", async () => {
                if (!m) return;
                await m.edit({ components: [new MessageActionRow().addComponents(previousbut.setDisabled(true), stopbut.setDisabled(true), nextbut.setDisabled(true))] });
            });

            collector.on("collect", async (b) => {
                if (!b.deferred) await b.deferUpdate().catch(() => { });
                if (b.customId === "Previous") {
                    page = page - 1 < 0 ? pages.length - 1 : --page;
                    if (!m) return;

                    embed.setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`);

                    return await m.edit({ embeds: [embed] });
                } else if (b.customId === "Stop") {
                    return collector.stop();
                } else if (b.customId === "playlist_cmd_uwu-next")
                    page = page + 1 >= pages.length ? 0 : ++page;
                if (!m) return;

                embed.setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`);

                return await m.edit({ embeds: [embed] });
            });
        }

    }
};