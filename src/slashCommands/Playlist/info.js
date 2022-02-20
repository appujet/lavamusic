const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const db = require("../../schema/playlist");
const i18n = require("../../utils/i18n");
const { convertTime } = require("../../utils/convert.js");
const lodash = require("lodash");

module.exports = {
    name: i18n.__("cmd.playlist.info.name"),
    description: i18n.__("cmd.playlist.info.des"),
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    options: [
        {
            name: i18n.__("cmd.playlist.slash.name"),
            description: i18n.__("cmd.playlist.slash.des"),
            required: true,
            type: "STRING"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name");
        const data = await db.findOne({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (!data) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__mf("cmd.playlist.info.noname", { name: Name }))] });
        }
        let tracks = data.Playlist.map((x, i) => `\`${+i}\` - ${x.title && x.uri ? `[${x.title}](${x.uri})` : `${x.title}`}${x.duration ? ` - \`${convertTime(Number(x.duration))}\`` : ""}`);
        const pages = lodash.chunk(tracks, 10).map((x) => x.join("\n"));
        let page = 0;

        const embed = new MessageEmbed()
            .setTitle(`${interaction.user.username}${i18n.__("cmd.playlist.info.author")}`)
            .setColor(client.embedColor)
            .setDescription(`${i18n.__mf("cmd.playlist.info.playembed", { pname: data.PlaylistName, plist: data.Playlist.length })}\n\n${pages[page]}`)
        if (pages.length <= 1) {
            return await interaction.editReply({ embeds: [embed] })
        }
        else {

            let previousbut = new MessageButton().setCustomId("playlist_cmd_ueuwbdl_uwu-previous").setEmoji("⏪").setStyle("SECONDARY");

            let nextbut = new MessageButton().setCustomId("playlist_cmd_uwu-next").setEmoji("⏩").setStyle("SECONDARY");

            let stopbut = new MessageButton().setCustomId("playlist_cmd_uwu-stop").setEmoji("⏹️").setStyle("SECONDARY");

            const row = new MessageActionRow().addComponents(previousbut, stopbut, nextbut);

            await interaction.editReply({ embeds: [embed], components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({
                filter: (b) => b.user.id === interaction.member.user.id ? true : false && b.deferUpdate().catch(() => { }),
                time: 60000 * 5,
                idle: 60000 * 5 / 2
            });

            collector.on("end", async () => {
                await interaction.editReply({ components: [new MessageActionRow().addComponents(previousbut.setDisabled(true), stopbut.setDisabled(true), nextbut.setDisabled(true))] });
            });

            collector.on("collect", async (b) => {
                if (!b.deferred) await b.deferUpdate().catch(() => { });
                if (b.customId === "playlist_cmd_ueuwbdl_uwu-previous") {
                    page = page - 1 < 0 ? pages.length - 1 : --page;

                    embed.setDescription(`${i18n.__mf("cmd.playlist.info.playembed", { pname: data.PlaylistName, plist: data.Playlist.length })}\n\n${pages[page]}`);

                    return await interaction.editReply({ embeds: [embed] });
                } else if (b.customId === "playlist_cmd_uwu-stop") {
                    return collector.stop();
                } else if (b.customId === "playlist_cmd_uwu-next")
                    page = page + 1 >= pages.length ? 0 : ++page;

                embed.setDescription(`${i18n.__mf("cmd.playlist.info.playembed", { pname: data.PlaylistName, plist: data.Playlist.length })}\n\n${pages[page]}`);

                return await interaction.editReply({ embeds: [embed] });
            });
        }

    }
};


