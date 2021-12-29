const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
    
module.exports = async (client, player, track, payload) => {
  const emojiplay = client.emoji.play;

  const thing = new MessageEmbed()
  
    .setDescription(`${emojiplay} [\`${track.title}\`](${track.uri})\n`)
    .setColor(client.embedColor)
    .setTimestamp()


   const But1 = new MessageButton().setCustomId("vdown").setEmoji("🔉").setStyle("SECONDARY");
    
   const But2 = new MessageButton().setCustomId("stop").setEmoji("⏹️").setStyle("SECONDARY");

   const But3 = new MessageButton().setCustomId("pause").setEmoji("⏯️").setStyle("SECONDARY");

   if (!player.playing) {
    But3 = But3.setStyle("PRIMARY").setEmoji("⏹️");
  }

   const But4 = new MessageButton().setCustomId("skip").setEmoji("⏭️").setStyle("SECONDARY");
    
   const But5 = new MessageButton().setCustomId("vup").setEmoji("🔊").setStyle("SECONDARY");

   const But6 = new MessageButton().setCustomId("prev").setEmoji("⏮️").setStyle("SECONDARY");

   const But7 = new MessageButton().setCustomId("rewind").setEmoji("⏪").setStyle("SECONDARY");

   const But8 = new MessageButton().setCustomId("autoPlay").setEmoji("♾️").setStyle("SECONDARY");

   const But9 = new MessageButton().setCustomId("loop").setEmoji("🔁").setStyle("SECONDARY");

   const But10 = new MessageButton().setCustomId("forward").setEmoji("⏩").setStyle("SECONDARY");

   const btnList1 = [But1, But6, But3, But4, But5];
   const btnList2 = [But7, But8, But2, But9, But10];


   const row1 = new MessageActionRow().addComponents(btnList1);
   const row2 = new MessageActionRow().addComponents(btnList2);
  
   
  let NowPlaying = await client.channels.cache
    .get(player.textChannel)
    .send({ embeds: [thing], components: [ row1, row2] });
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
              i.reply({content: `🔉 Volume set to ${amount} `, ephemeral: true});
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
                if (!player.playing) {
                  player.pause(false);
                  i.reply({content: `▶ Resumed!`, ephemeral: true});
                }else {
                  //pause the player
                  player.pause(true);
                  i.reply({content: `⏸ Paused!`, ephemeral: true});
                }
                
            } else if (i.customId === "skip") {
                if (!player) {
                    return collector.stop();
                }
                await player.stop();
                if (player.get("autoplay")) return autoplay(client, player, "skip");
                i.reply({content: "⏭️ I have skipped to the next song!", ephemeral: true});
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
               i.reply({content: `🔊 Volume set to ${amount} `, ephemeral: true});
                return;
            }

            if (i.customId === "rewind") {
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
             i.reply({content: `⏪ Rewinded the song for \`-10 Seconds\`! `, ephemeral: true});
          }

          if (i.customId === "forward") {
            if (!player) {
              return collector.stop();
            }
            //get the seektime variable of the user input
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
           i.reply({content: `⏩ Forwarded the song for \`+10 Seconds\`!`, ephemeral: true});
        }

        if (i.customId === "loop") {
          if (!player) {
            return collector.stop();
          }
          //if there is active queue loop, disable it + add embed information
          if (player.queueRepeat) {
            player.setQueueRepeat(false);
          }
          //set track repeat to revers of old track repeat
          player.setTrackRepeat(!player.trackRepeat);
         i.reply({content: `${player.trackRepeat ? `✅ Enabled Song Loop`: `❌ Disabled Song Loop`}`, ephemeral: true});
      }

      if (i.customId === "prev") {
        if (!player) {
          return collector.stop();
      }
      await player.stop();
      i.reply({content: "⏭️ I have played previous to the next song!", ephemeral: true});
      if (track.length === -1) {
          return collector.stop();
      }
       
    }

    if (i.customId === "autoPlay") {
      if (!player) {
        return collector.stop();
      }
      //if there is active queue loop, disable it + add embed information
      player.set(`autoplay`, !player.get(`autoplay`))
              
     i.reply({content: `${player.get(`autoplay`) ? `✅ Enabled Song Loop**`: `❌ Disabled Song Loop`}`, ephemeral: true});
  }
      });
}

