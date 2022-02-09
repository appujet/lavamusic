const { MessageEmbed } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    category: "Music",
    description: "Show now playing song",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
execute: async (message, args, client, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("<:err:935798200869208074> There is no music playing.");
            return message.channel.send(thing);
        }
        const song = player.queue.current
        const emojimusic = client.emoji.music;
        var total = song.duration;
        var current = player.position;
        
        let embed = new MessageEmbed()
            .setAuthor({text:'Now playing', iconURL: 'https://i.imgur.com/mbqI9je.png'})
            .setDescription(`[${song.title}](${song.uri}) \`${convertTime(song.duration)}\`\nRequested by: ${song.requester} \n\n \`${convertTime(current)}\` \`${progressbar(player)}\` \`${convertTime(total)}\``)
            .setThumbnail(song.displayThumbnail("3"))
            .setColor(client.embedColor)
            return message.channel.send({embeds: [embed]})

    }
}
