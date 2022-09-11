const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { trackStartEventHandler } = require("../../utils/functions");
const db = require("../../schema/setup");
module.exports = async (client, player, track, payload) => {
  let guild = client.guilds.cache.get(player.guild);
  if (!guild) return;
  let channel = guild.channels.cache.get(player.textChannel);
  if (!channel) return;
  let data = await db.findOne({ Guild: guild.id });
  if (data) {
    if (!data.Channel) data.Channel = channel.id;

    let textChannel = guild.channels.cache.get(data.Channel);
    console.log(data.Channel + "" + textChannel);
    if (!textChannel) {
      try {
        textChannel = await guild.channels.fetch(data.Channel);
      } catch {
        channel.send("Please run /setup as I am unable to find the channel");
        textChannel = channel;
      }
    }

    const id = data.Message;
    if (channel.id === textChannel.id) {
      return await trackStartEventHandler(
        id,
        textChannel,
        player,
        track,
        client
      );
    } else {
      await trackStartEventHandler(id, textChannel, player, track, client);
    }
  }
  const emojiplay = client.emoji.play;
  const volumeEmoji = client.emoji.volumehigh;
  const emojistop = client.emoji.stop;
  const emojipause = client.emoji.pause;
  const emojiresume = client.emoji.resume;
  const emojiskip = client.emoji.skip;
  const queue = player.get("dcQ");
  const thing = new EmbedBuilder()
    .setDescription(
      `${emojiplay} **Started Playing**\n [${track?.title ?? queue.title}](${
        track?.uri ?? queue.uri
      }) - \`[${convertTime(track?.duration ?? queue.duration)}]\``
    )
    .setThumbnail(
      track?.thumbnail ??
        (await client.manager.getMetaThumbnail(track?.uri ?? queue.uri))
    )
    .setColor(client.embedColor)
    .setTimestamp();
  const But1 = new ButtonBuilder()
    .setCustomId("vdown")
    .setEmoji({ name: "🔉" })
    .setStyle(ButtonStyle.Secondary);
  const But2 = new ButtonBuilder()
    .setCustomId("stop")
    .setEmoji({ name: "⏹️" })
    .setStyle(ButtonStyle.Secondary);
  const But3 = new ButtonBuilder()
    .setCustomId("pause")
    .setEmoji({ name: "⏸️" })
    .setStyle(ButtonStyle.Secondary);
  const But4 = new ButtonBuilder()
    .setCustomId("skip")
    .setEmoji({ name: "⏭️" })
    .setStyle(ButtonStyle.Secondary);
  const But5 = new ButtonBuilder()
    .setCustomId("vup")
    .setEmoji({ name: "🔊" })
    .setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder().addComponents(
    But1,
    But2,
    But3,
    But4,
    But5
  );
  const m = await channel.send({ embeds: [thing], components: [row] });
  await player.setNowplayingMessage(m);
  const embed = new EmbedBuilder().setColor(client.embedColor).setTimestamp();
  const collector = m.createMessageComponentCollector({
    filter: (b) => {
      if (
        b.guild.members.me.voice.channel &&
        b.guild.members.me.voice.channelId === b.member.voice.channelId
      )
        return true;
      else {
        b.reply({
          content: `You are not connected to ${b.guild.members.me.voice.channel.toString()} to use this buttons.`,
          ephemeral: true,
        });
        return false;
      }
    },
    time: track?.duration ?? queue.duration,
  });
  collector.on("collect", async (i) => {
    await i.deferReply({
      ephemeral: false,
    });
    if (i.customId === "vdown") {
      if (!player) {
        return collector.stop();
      }
      let amount = Number(player.volume) - 10;
      await player.setVolume(amount);
      i.editReply({
        embeds: [
          embed
            .setAuthor({
              name: i.member.user.tag,
              iconURL: i.member.user.displayAvatarURL(),
            })
            .setDescription(
              `${volumeEmoji} The current volume is: **${amount}**`
            ),
        ],
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
    } else if (i.customId === "stop") {
      if (!player) {
        return collector.stop();
      }
      await player.stop();
      await player.queue.clear();
      i.editReply({
        embeds: [
          embed
            .setAuthor({
              name: i.member.user.tag,
              iconURL: i.member.user.displayAvatarURL(),
            })
            .setDescription(`${emojistop} Stopped the music`),
        ],
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
      return collector.stop();
    } else if (i.customId === "pause") {
      if (!player) {
        return collector.stop();
      }
      player.pause(!player.paused);
      const Text = player.paused
        ? `${emojipause} **Paused**`
        : `${emojiresume} **Resume**`;
      i.editReply({
        embeds: [
          embed
            .setAuthor({
              name: i.member.user.tag,
              iconURL: i.member.user.displayAvatarURL(),
            })
            .setDescription(
              `${Text} \n[${player.queue.current.title}](${player.queue.current.uri})`
            ),
        ],
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
    } else if (i.customId === "skip") {
      if (!player) {
        return collector.stop();
      }

      await player.stop();
      i.editReply({
        embeds: [
          embed
            .setAuthor({
              name: i.member.user.tag,
              iconURL: i.member.user.displayAvatarURL(),
            })
            .setDescription(
              `${emojiskip} **Skipped**\n[${player.queue.current.title}](${player.queue.current.uri})`
            ),
        ],
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
      if (player.queue.length === 1) {
        return collector.stop();
      }
    } else if (i.customId === "vup") {
      if (!player) {
        return collector.stop();
      }
      let amount = Number(player.volume) + 10;
      if (amount >= 150)
        return i
          .editReply({
            embeds: [
              embed
                .setAuthor({
                  name: i.member.user.tag,
                  iconURL: i.member.user.displayAvatarURL(),
                })
                .setDescription(
                  `Cannot higher the player volume further more.`
                ),
            ],
          })
          .then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 10000);
          });
      await player.setVolume(amount);
      i.editReply({
        embeds: [
          embed
            .setAuthor({
              name: i.member.user.tag,
              iconURL: i.member.user.displayAvatarURL(),
            })
            .setDescription(
              `${volumeEmoji} The current volume is: **${amount}**`
            ),
        ],
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
      return;
    }
  });
};
