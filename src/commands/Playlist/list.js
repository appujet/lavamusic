const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");
const i18n = require("../../utils/i18n");
const lodash = require("lodash");

module.exports = {
    name: i18n.__("cmd.playlist.list.name"),
    aliases: i18n.__("cmd.playlist.list.aliases"),
    category: "Playlist",
    description: i18n.__("cmd.playlist.list.des"),
    args: false,
    usage: i18n.__("cmd.playlist.list.use"),
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.find({ UserId: message.author.id});
        if (!data.length) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(i18n.__("cmd.playlist.list.noembed"))] })
        }
        if(!args[0]) {
            let list = data.map((x, i) => `\`${++i}\` - ${x.PlaylistName} \`${x.Playlist.length}\` - <t:${x.CreatedOn}>`);
            const pages = lodash.chunk(list, 10).map((x) => x.join("\n"));
            let page = 0;
           
            const embeds = new MessageEmbed()
                .setAuthor({ name: `${message.author.username}${i18n.__("cmd.playlist.list.author")}`, iconURI: message.author.displayAvatarURL() })
                .setDescription(pages[page])
                .setFooter({ text: i18n.__mf("cmd.playlist.list.footer", {list: list.length})})
                .setColor(client.embedColor);
            return await message.channel.send({ embeds: [embeds] });

        }

    }
};