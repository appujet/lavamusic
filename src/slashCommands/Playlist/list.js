const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");
const db = require("../../schema/playlist");
const lodash = require("lodash");
module.exports = {
    name: i18n.__("cmd.playlist.list.name"),
    description: i18n.__("cmd.playlist.list.des"),
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {

        await interaction.deferReply({});
        const data = await db.find({ UserId: interaction.member.user.id });

        if (!data.length) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.list.noembed"))] })
        }

        let list = data.map((x, i) => `\`${++i}\` - ${x.PlaylistName} \`${x.Playlist.length}\` - <t:${x.CreatedOn}>`);
        const pages = lodash.chunk(list, 10).map((x) => x.join("\n"));
        let page = 0;
       
        const embeds = new MessageEmbed()
            .setAuthor({ name: `${interaction.user.username}${i18n.__("cmd.playlist.list.author")}`, iconURI: interaction.user.displayAvatarURL() })
            .setDescription(pages[page])
            .setFooter({ text: i18n.__mf("cmd.playlist.list.footer", {list: list.length})})
            .setColor(client.embedColor);
        return await interaction.editReply({ embeds: [embeds] });

    

}
};