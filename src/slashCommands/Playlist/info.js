const { EmbedBuilder, CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const db = require("../../schema/playlist");
const { convertTime } = require("../../utils/convert.js");
const lodash = require("lodash");

module.exports = {
    name: "info",
    description: "Get information about your saved playlist.",
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    options: [
        {
            name: "name",
            description: "Playlist Name",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name").replace(/_/g, ' ');
        const data = await db.findOne({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`You don't have a playlist called **${Name}**.`)] });
        }
        let tracks = data.Playlist.map((x, i) => `\`${+i}\` - ${x.title && x.uri ? `[${x.title}](${x.uri})` : `${x.title}`}${x.duration ? ` - \`${convertTime(Number(x.duration))}\`` : ""}`);
        const pages = lodash.chunk(tracks, 10).map((x) => x.join("\n"));
        let page = 0;

        const pname = data.PlaylistName;
        const plist = data.Playlist.length;

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Playlists`)
            .setColor(client.embedColor)
            .setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`)
        if (pages.length <= 1) {
            return await interaction.editReply({ embeds: [embed] })
        }
        else {

            let previousbut = new ButtonBuilder().setCustomId("Previous").setEmoji({ name: "⏪" }).setStyle(ButtonStyle.Secondary);

            let nextbut = new ButtonBuilder().setCustomId("Next").setEmoji({ name: "⏩" }).setStyle(ButtonStyle.Secondary);

            let stopbut = new ButtonBuilder().setCustomId("Stop").setEmoji({ name: "⏹️" }).setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(previousbut, stopbut, nextbut);

            await interaction.editReply({ embeds: [embed], components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({
                filter: (b) => b.user.id === interaction.member.user.id ? true : false && b.deferUpdate().catch(() => { }),
                time: 60000 * 5,
                idle: 60000 * 5 / 2
            });

            collector.on("end", async () => {
                await interaction.editReply({ components: [new ActionRowBuilder().addComponents(previousbut.setDisabled(true), stopbut.setDisabled(true), nextbut.setDisabled(true))] });
            });

            collector.on("collect", async (b) => {
                if (!b.deferred) await b.deferUpdate().catch(() => { });
                if (b.customId === "Previous") {
                    page = page - 1 < 0 ? pages.length - 1 : --page;

                    embed.setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`);

                    return await interaction.editReply({ embeds: [embed] });
                } else if (b.customId === "Stop") {
                    return collector.stop();
                } else if (b.customId === "Next")
                    page = page + 1 >= pages.length ? 0 : ++page;

                embed.setDescription(`**Playlist Name** ${pname} **Total Tracks** \`${plist}\`\n\n${pages[page]}`);

                return await interaction.editReply({ embeds: [embed] });
            });
        }

    }
};


