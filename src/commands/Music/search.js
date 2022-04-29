const { MessageEmbed, MessageButton, MessageActionRow, Permissions } = require("discord.js");
const { convertTime } = require("../../utils/convert");

module.exports = {
    name: "search",
    description: "search for a song from youtube",
    category: "Music",
    aliases: [],
    usage: [`serach Never gonna give you up`],
    args: true,
    Permissions: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
   execute: async (message, args, client) => { 

    const { channel } = message.member.voice;
    if (!message.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)]});
    if (!message.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)]});

    let player = message.client.manager.get(message.guildId);
    if(!player)
     player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        volume: 80,
        selfDeafen: true,
      }) 
      if(player && player.state !== "CONNECTED") player.connect();

    const query = args.join(" ");
  
    const msg = await message.channel.send({embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`? Searching ${query} song please wait`)]})
    
    const but = new MessageButton().setCustomId("s_one").setLabel("1").setStyle("SUCCESS");
    const but2 = new MessageButton().setCustomId("s_two").setLabel("2").setStyle("SUCCESS");
    const but3 = new MessageButton().setCustomId("s_three").setLabel("3").setStyle("SUCCESS");
    const but4 = new MessageButton().setCustomId("s_four").setLabel("4").setStyle("SUCCESS");
    const but5 = new MessageButton().setCustomId("s_five").setLabel("5").setStyle("SUCCESS");
    const row = new MessageActionRow().addComponents(but, but2, but3, but4, but5);

    const emojiplaylist = client.emoji.playlist;
 
    let s = await player.search(query, message.author);
    switch (s.loadType) {
        case "TRACK_LOADED":
            player.queue.add(s.tracks[0]);
            const embed = new MessageEmbed()
             .setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[0].title}](${s.tracks[0].uri}) \`${convertTime(s.tracks[0].duration, true)}\` • ${s.tracks[0].requester}`)
             .setColor(client.embedColor)

            msg.edit({ embeds: [embed] });
            if (!player.playing) player.play()
            break;
         case "SEARCH_RESULT":
             let index = 1;
             const tracks = s.tracks.slice(0, 5);
             const results = s.tracks.slice(0, 5).map(x => `• ${index++} | [${x.title}](${x.uri}) \`${convertTime(x.duration)}\``)
                    .join("\n");
                    const searched = new MessageEmbed()
                        .setTitle("Select the track that you want")
                        .setColor(client.embedColor)
                        .setDescription(results);

                    await msg.edit({embeds: [searched], components: [row] });
                    const search = new MessageEmbed()
                    .setColor(client.embedColor);

            const collector = msg.createMessageComponentCollector({
                filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate(),
                max: 1,
                time: 60000,
                idle: 60000/2
            });
            collector.on("end", async (collected) => {
                if(msg) await msg.edit({ components: [new MessageActionRow().addComponents(but.setDisabled(true), but2.setDisabled(true), but3.setDisabled(true), but4.setDisabled(true), but5.setDisabled(true))] })
                                    
            });
            collector.on("collect", async (b) => {
                if(!b.deferred) await  b.deferUpdate();
                if(!player && !collector.ended) return collector.stop();
                if(player.state !== "CONNECTED") player.connect();

                if(b.customId === "s_one") {
                    player.queue.add(s.tracks[0]);
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
 
                        if(msg) await msg.edit({embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[0].title}](${s.tracks[0].uri}) \`${convertTime(s.tracks[0].duration, true)}\` • ${s.tracks[0].requester}`)]})
                } else if(b.customId === "s_two") {
                    player.queue.add(s.tracks[1]);
                    if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                    if(msg) await msg.edit({embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[1].title}](${s.tracks[1].uri}) \`${convertTime(s.tracks[1].duration, true)}\` • ${s.tracks[1].requester}`)]})
            
                } else if(b.customId === "s_three") {
                    player.queue.add(s.tracks[2]);
                    if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                    if(msg) await msg.edit({embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[2].title}](${s.tracks[2].uri}) \`${convertTime(s.tracks[2].duration, true)}\` • ${s.tracks[2].requester}`)]})
            
                } else if(b.customId === "s_four") {
                    player.queue.add(s.tracks[3]);
                    if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                    if(msg) await msg.edit({embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[3].title}](${s.tracks[3].uri}) \`${convertTime(s.tracks[3].duration, true)}\` • ${s.tracks[3].requester}`)]})
            
                } else if(b.customId === "s_five") {
                    player.queue.add(s.tracks[4]);
                    if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                    if(msg) await msg.edit({embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[4].title}](${s.tracks[4].uri}) \`${convertTime(s.tracks[4].duration, true)}\` • ${s.tracks[4].requester}`)]})
            
                }
 
            });

        }
        
    }
}



