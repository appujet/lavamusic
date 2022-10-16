const { EmbedBuilder } = require("discord.js");
const { convertTime, convertHmsToMs } = require('../../utils/convert.js')
const ms = require('ms');

module.exports = {
  	name: "seek",
  	aliases: [],
  	category: "Music",
  	description: "Seek the currently playing song.",
    args: false,
    usage: "<10s || 10m || 10h || HH:mm:ss || mm:ss || mm ss>",
    userPerms: [],
    dj: true,
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
 execute: async (message, args, client, prefix) => {
  
		const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [thing]});
        }

        let time = args.join(" ");
        /^[0-9 :.-]+$/.test(time) ? time = convertHmsToMs(time) : time = ms(time);
        const position = player.position;
        const duration = player.queue.current.duration;

        const emojiforward = client.emoji.forward;
        const emojirewind = client.emoji.rewind;

        const song = player.queue.current;
        
        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setDescription(`${emojiforward} **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setTimestamp()
                return message.reply({embeds: [thing]});
            } else {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setDescription(`${emojirewind} **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setTimestamp()
          return message.reply({embeds: [thing]});
            }
        } else {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Seek duration exceeds song duration.\nRequested: \`${convertTime(time)}\`\nSong duration: \`${convertTime(duration)}\``);
            return message.reply({embeds: [thing]});
        }
	
    }
};
