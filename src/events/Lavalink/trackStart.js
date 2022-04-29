const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');


module.exports = async (client, player, track, payload) => {
      
  const emojiplay = client.emoji.play;
  const volumeEmoji = client.emoji.volumehigh;
  const emojistop = client.emoji.stop;
  const emojipause = client.emoji.pause;
  const emojiresume = client.emoji.resume;
  const emojiskip = client.emoji.skip;

  const thing = new MessageEmbed()
    .setDescription(`${emojiplay} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\``)
    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
    .setColor(client.embedColor)
    .setTimestamp()
  const But1 = new MessageButton().setCustomId("vdown").setEmoji("🔉").setStyle("SECONDARY");

  const But2 = new MessageButton().setCustomId("stop").setEmoji("⏹️").setStyle("SECONDARY");

  const But3 = new MessageButton().setCustomId("pause").setEmoji("⏸️").setStyle("SECONDARY");

  const But4 = new MessageButton().setCustomId("skip").setEmoji("⏭️").setStyle("SECONDARY");

  const But5 = new MessageButton().setCustomId("vup").setEmoji("🔊").setStyle("SECONDARY");

  const row = new MessageActionRow().addComponents(But1, But2, But3, But4, But5);

  let NowPlaying = await client.channels.cache.get(player.textChannel).send({ embeds: [thing], components: [row] });
  player.setNowplayingMessage(NowPlaying);

  const embed = new MessageEmbed()
    .setColor(client.embedColor)
    .setTimestamp();
  const collector = NowPlaying.createMessageComponentCollector({
    filter: (b) => {
      if (b.guild.me.voice.channel && b.guild.me.voice.channelId === b.member.voice.channelId) return true;
      else {
        b.reply({ content: `You are not connected to ${b.guild.me.voice.channel} to use this buttons.`, ephemeral: true }); return false;
      };
    },
    time: track.duration,
  });
  collector.on("collect", async (i) => {
    await i.deferReply({
      ephemeral: false
    });
    if (i.customId === "vdown") {
      if (!player) {
        return collector.stop();
      }
      let amount = Number(player.volume) - 10;
      await player.setVolume(amount);
      i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${volumeEmoji} The current volume is: **${amount}**`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
    } else if (i.customId === "stop") {
      if (!player) {
        return collector.stop();
      }
      await player.stop();
      await player.queue.clear();
      i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${emojistop} Stopped the music`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
      return collector.stop();
    } else if (i.customId === "pause") {
      if (!player) {
        return collector.stop();
      }
      player.pause(!player.paused);
      const Text = player.paused ? `${emojipause} **Paused**` : `${emojiresume} **Resume**`;
      i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${Text} \n[${player.queue.current.title}](${player.queue.current.uri})`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
    } else if (i.customId === "skip") {
      if (!player) {
        return collector.stop();
      }
      await player.stop();
      i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${emojiskip} **Skipped**\n[${player.queue.current.title}](${player.queue.current.uri})`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
      if (track.length === 1) {
        return collector.stop();
      }
    } else if (i.customId === "vup") {
      if (!player) {
        return collector.stop();
      }
      let amount = Number(player.volume) + 10;
      if (amount >= 150) return i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`Cannot higher the player volume further more.`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
      await player.setVolume(amount);
      i.editReply({ embeds: [embed.setAuthor({ name: i.member.user.tag, iconURL: i.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${volumeEmoji} The current volume is: **${amount}**`)] }).then(msg => { setTimeout(() => { msg.delete() }, 10000) });
      return;
    }
  });
};