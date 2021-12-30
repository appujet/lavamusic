const Discord = require('discord.js')
require('discord-reply')
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')

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
            .setColor("#FFC942")
                .setDescription("> There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const song = player.queue.current

        const emojimusic = message.client.emoji.music;

        // Progress Bar
        var total = song.duration;
        var current = player.position;
let dm = new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL())
.setDescription(`\`\`📬 Check Your Dms!\`\``)
.setColor('BLURPLE')
.setFooter(`Requested By ${message.author.tag}`).setTimestamp()
message.reply({embeds: [dm]})

const urlbutt = new MessageButton().setEmoji("🔎").setStyle("LINK").setURL(song.uri)
const row = new MessageActionRow().addComponents(urlbutt)
        let embed = new MessageEmbed()
            .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${convertTime(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${message.author.id}>]`)
            .setThumbnail(song.displayThumbnail())
            .setColor("BLURPLE")
            .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
         return message.author.send({embeds: [embed], components: [row]})
            
    }
};
