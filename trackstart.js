const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
    
module.exports = async (client, player, track, payload) => {
  const emojiplay = client.emoji.play;

  const thing = new MessageEmbed()
      .setTitle(`<a:playing:919580939720482816> Now Playing`)
      .setDescription(`[\`${track.title}\`](${track.uri})- \`[${convertTime(track.duration)}]\`\n`)
      .setImage(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
      .setColor(client.embedColor)
      .setTimestamp()


    const But1 = new MessageButton().setCustomId("vdown").setEmoji("🔉").setStyle("PRIMARY");
    
    const But2 = new MessageButton().setCustomId("prev").setEmoji("⏮️").setStyle("PRIMARY").setDisabled(true);
 
    const But3 = new MessageButton().setCustomId("pause").setEmoji("⏸").setStyle("PRIMARY");
 
    const But4 = new MessageButton().setCustomId("skip").setEmoji("⏭️").setStyle("PRIMARY");
     
    const But5 = new MessageButton().setCustomId("vup").setEmoji("🔊").setStyle("PRIMARY");

    const But6 = new MessageButton().setCustomId("m10").setEmoji("⏪").setStyle("PRIMARY");
    
    const But7 = new MessageButton().setCustomId("autoplay").setEmoji("♾️").setStyle("PRIMARY").setDisabled(true);
 
    const But8 = new MessageButton().setCustomId("stop").setEmoji("⏹").setStyle("PRIMARY");
 
    const But9 = new MessageButton().setCustomId("loop").setEmoji("🔁").setStyle("PRIMARY");
     
    const But10 = new MessageButton().setCustomId("p10").setEmoji("⏩").setStyle("PRIMARY");
    
    const row = new MessageActionRow().addComponents(But1, But2, But3, But4, But5);
    
    const row1 = new MessageActionRow().addComponents(But6, But7, But8, But9, But10);
    
   let NowPlaying = await client.channels.cache
     .get(player.textChannel)
     .send({ embeds: [thing], components: [row, row1] });
   player.setNowplayingMessage(NowPlaying);
   
   const collector = NowPlaying.createMessageComponentCollector({
     filter: (b) => {
       if(b.guild.me.voice.channel && b.guild.me.voice.channelId === b.member.voice.channelId) return true;
       else {
         b.reply({content: `You are not connected to ${b.guild.me.voice.channel} to use this buttons.`, ephemeral: true}); return false;
         };
      },
      time: track.duration,
       });
         collector.on("collect", async (i) => {
             if (i.customId === "vdown") {
                if (!player) {
                  return collector.stop();
                }
               let amount = Number(player.volume) - 10;
                await player.setVolume(amount);
               i.reply({content: `Volume set to ${amount} `, ephemeral: true});
            } else if (i.customId === "stop") {
                 if (!player) {
                     return collector.stop();
                 }
                 await player.stop();
                 await player.queue.clear();
                 i.reply({content: "Music Is Stopped", ephemeral: true});
                 return collector.stop();
             } else if (i.customId === "pause") {
                 if (!player) {
                     return collector.stop();
                 }
                 player.pause(!player.paused);
                 const Text = player.paused ? "paused" : "resume";
                 i.reply({content: `I have ${Text} the music!`, ephemeral: true});
             } else if (i.customId === "skip") {
                 if (!player) {
                     return collector.stop();
                 }
                 await player.stop();
                 i.reply({content: "I have skipped to the next song!", ephemeral: true});
                 if (track.length === 1) {
                     return collector.stop();
                 }
             } else if (i.customId === "vup") {
                if (!player) {
                  return collector.stop();
                }
                let amount = Number(player.volume) + 10;
             if(amount >= 150) return i.reply({ content: `Cannot higher the player volume further more.`, ephemeral: true });
                await player.setVolume(amount);
                i.reply({content: `Volume set to ${amount} `, ephemeral: true});
                 return;
             } else if (i.customId === "m10") {
              if (!player) {
                  return collector.stop();
              }
              let seektime = player.position - 10 * 1000;
              if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                seektime = 0;
              }
              //seek to the new Seek position
              player.seek(Number(seektime));
              collector.resetTimer({
                time: (player.queue.current.duration - player.position) * 1000
              })
              i.reply({content: "⏪ **Rewinded the song for \`10 Seconds\`!**", ephemeral: true});
              if (track.length === 1) {
                  return collector.stop();
              }
            } else if (i.customId === "autoplay") {
              if (!player) {
                  return collector.stop();
              }
              
              
              i.reply({content: "⏪ **Rewinded the song for \`10 Seconds\`!**", ephemeral: true});
              if (track.length === 1) {
                  return collector.stop();
              }
            } else if (i.customId === "p10") {
              if (!player) {
                  return collector.stop();
              }
              let seektime = Number(player.position) + 10 * 1000;
              //if the userinput is smaller then 0, then set the seektime to just the player.position
              if (10 <= 0) seektime = Number(player.position);
              //if the seektime is too big, then set it 1 sec earlier
              if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
              //seek to the new Seek position
              player.seek(Number(seektime));
              collector.resetTimer({
                time: (player.queue.current.duration - player.position) * 1000
              })
              
              
              i.reply({content: "⏩ **Forwarded the song for \`10 Seconds\`!**", ephemeral: true});
              if (track.length === 1) {
                  return collector.stop();
              }
            } else if (i.customId === "loop") {
              if (!player) {
                  return collector.stop();
              }
              if (player.queueRepeat) {
                player.setQueueRepeat(false);
              }
              //set track repeat to revers of old track repeat
              player.setTrackRepeat(!player.trackRepeat);
              
              i.reply({content: `${player.trackRepeat ? `<:right:927434790087577600> **Enabled Song Loop**`: `<:wrong:927437620882059304> **Disabled Song Loop**`}`});
              if (track.length === 1) {
                  return collector.stop();
              }
            }



       });
 }
