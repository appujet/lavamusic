const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "grab",
    aliases: ["save"],
    category: "Music",
    description: "Grabs And Sends You The Song That Is Playing At The Moment",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
            .setColor("RED")
            .setDescription("<:err:935798200869208074> There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const song = player.queue.current
        const total = song.duration;
        const current = player.position;

        const dmbut = new MessageButton().setLabel("Check Your dms").setStyle("LINK").setURL(`https://discord.com/me/${client.id}`)
        const row = new MessageActionRow().addComponents(dmbut)

        let dm = new MessageEmbed()
        .setAuthor({ name: 'Shazam', iconURL: 'https://i.imgur.com/4vfBUAz.png'})
        .setDescription(`Song added to library!`)
        .setColor(client.embedColor)
        .setFooter({text: `Requested by ${message.author.tag}`, iconURL: message.author.avatarURL()})
        .setTimestamp()
        message.reply({embeds: [dm], components: [row]})
        
        const urlbutt = new MessageButton().setLabel("Search").setStyle("LINK").setURL(song.uri)
        const row2 = new MessageActionRow().addComponents(urlbutt)
        let embed = new MessageEmbed()
            .setAuthor({ name: 'Shazam', iconURL: 'https://i.imgur.com/4vfBUAz.png'})
            .setDescription(`**Song name**: [${song.title}](${song.uri})\n**Duration:** \`[${convertTime(song.duration)}]\` \n**Song played by**: <@${song.requester.id}>`)
            .setThumbnail(song.displayThumbnail())
            .setColor(client.embedColor)
            .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
         return message.author.send({embeds: [embed], components: [row2]})
            
    }
};
