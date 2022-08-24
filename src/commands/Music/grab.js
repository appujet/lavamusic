const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "grab",
    aliases: ["save"],
    category: "Music",
    description: "Grabs and sends you the song that is currently playing.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
            .setColor(0xFFC942)
            .setDescription("> There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const song = player.queue.current
        const total = song.duration;
        const current = player.position;

        const dmbut = new ButtonBuilder().setLabel("Check Your DMs").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${client.id}`)
        const row = new ActionRowBuilder().addComponents(dmbut)

        let dm = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL()})
        .setDescription(`:mailbox_with_mail: \`Check Your DMs!\``)
        .setColor(client.embedColor)
        .setFooter({text: `Requested By ${message.author.tag}`})
        .setTimestamp()
        message.reply({embeds: [dm], components: [row]})
        
        const urlbutt = new ButtonBuilder().setLabel("Search").setStyle(ButtonStyle.Link).setURL(song.uri)
        const row2 = new ActionRowBuilder().addComponents(urlbutt)
        let embed = new EmbedBuilder()
            .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${convertTime(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${message.author.id}>]`)
            .setThumbnail(song.displayThumbnail())
            .setColor(client.embedColor)
            .addFields([
                { name: "\u200b", value: `\`${convertTime(current)} / ${convertTime(total)}\`` }
            ])
         return message.author.send({embeds: [embed], components: [row2]}).catch(() => null);
            
    }
};
