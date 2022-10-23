const {
  Message,
  EmbedBuilder,
  Client,
  TextChannel,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { Player } = require("erela.js");
const Model = require("../schema/247");
const db = require("../schema/setup");
const MusicBot = require("../structures/Client");
const { convertTime } = require("./convert");

/**
 * @param {MusicBot} client
 * @param {string} guild 
 * @param {string} textchannel 
 * @param {string} voicechannel
 * @returns {boolean}
 */
async function check(client, guild, textchannel, voicechannel) {
  let isGuild;
  let isChannel;
  const resolveGuild = await client.guilds.fetch(guild).catch(() => isGuild = false);

  if (isGuild === false) return false;

  await resolveGuild.channels.fetch(textchannel).catch(() => isChannel = false);
  await resolveGuild.channels.fetch(voicechannel).catch(() => isChannel = false);

  if (isChannel === false) return false;

  return true;
}

/**
 * @typedef {Object} ConnectionData
 * @property {boolean} status 24/7 Status
 * @property {string} guild Availaible Guild
 * @property {string} voicechannel Voice Channel
 * @property {string} textchannel Text Channel
 */

/**
 *
 * @param {ConnectionData} data
 * @param {MusicBot} client Extended Client
 * @returns {boolean}
 */

async function AutoConnect(data, client) {
  const { status, guild, voicechannel, textchannel } = data;
  const obtainedBool = await check(client, guild, textchannel, voicechannel);

  if (!obtainedBool) {
    const data = await Model.findOne({ Guild: guild, VoiceChannel: voicechannel, TextChannel: textchannel });
    if (!data) return;
    await data.delete();
    return
  }

  /**
   * @type {Player}
   */
  let player = client.manager.players.get(guild);
  if (!player && status)
    player = client.manager.create({
      guild,
      voiceChannel: voicechannel,
      textChannel: textchannel,
      selfDeafen: true,
      selfMute: false,
    });

  if(player && player.state !== "CONNECTED") player.connect();

  return (player.twentyFourSeven = status);
}

/**
 *
 * @param {TextChannel} channel
 * @param {String} args
 */

async function oops(channel, args) {
  try {
    let embed1 = new EmbedBuilder().setColor("Red").setDescription(`${args}`);

    const m = await channel.send({
      embeds: [embed1],
    });

    setTimeout(async () => await m.delete().catch(() => { }), 12000);
  } catch (e) {
    return console.error(e);
  }
}

/**
 *
 * @param {String} query
 * @param {Player} player
 * @param {Message} message
 * @param {Client}  client
 */

function neb(embed, player, client) {
  const config = require("../config");
  let icon = player.queue.current.identifier
    ? `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
    : config.links.img;

  return embed
    .setDescription(
      `[${player.queue.current.title}](${player.queue.current.uri
      }) by ${player.queue.current.author} • \`[${convertTime(player.queue.current.duration)}]\``
    )
    .setImage(icon)
    .setFooter({
      text: `Requested by ${player.queue.current.requester.username}`,
      iconURL: player.queue.current.requester.displayAvatarURL({
        dynamic: true,
      }),
    });
}

/**
 *
 * @param {String} query
 * @param {Player} player
 * @param {Message} message
 * @param {Client}  client
 */

async function playerhandler(query, player, message) {
  let m;
  let d = await db.findOne({ Guild: message.guildId });
  let n = new EmbedBuilder().setColor(message.client.embedColor);

  try {
    if (d)
      m = await message.channel.messages.fetch({
        message: d.Message,
        cache: true,
      });
  } catch (e) { }

  if (!message.guild.members.me.voice.channel || player.state !== "CONNECTED")
    player.connect();
  let s = await player.search(query, message.author);
  if (s.loadType === "LOAD_FAILED") {
    if (!player.queue.current) player.destroy();
    return await oops(message.channel, `Failed to load ${query}`);
  } else if (s.loadType === "NO_MATCHES") {
    if (!player.queue.current) player.destroy();
    return await oops(message.channel, `No results found for ${query}`);
  } else if (s.loadType === "PLAYLIST_LOADED") {
    if (player.state !== "CONNECTED") player.connect();
    if (player) player.queue.add(s.tracks);
    if (
      player &&
      player.state === "CONNECTED" &&
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === s.tracks.length
    )
      await player.play();

    await message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setDescription(
              `Added \`[ ${s.tracks.length} ]\` tracks from [${s.playlist.name}](${query}) to the queue.`
            ),
        ],
      })
      .then((a) =>
        setTimeout(async () => await a.delete().catch(() => { }), 5000)
      )
      .catch(() => { });

    neb(n, player);
    if (m) await m.edit({ embeds: [n] }).catch(() => { });
  } else if (s.loadType === "SEARCH_RESULT") {
    if (player.state !== "CONNECTED") player.connect();
    if (player) player.queue.add(s.tracks[0]);
    if (
      player &&
      player.state === "CONNECTED" &&
      !player.playing &&
      !player.paused &&
      !player.queue.size
    )
      return await player.play();

    await message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setDescription(
              `Added [${s.tracks[0].title}](${s.tracks[0].uri}) to the queue.`
            ),
        ],
      })
      .then((a) =>
        setTimeout(async () => await a.delete().catch(() => { }), 5000)
      )
      .catch(() => { });

    neb(n, player);
    if (m) await m.edit({ embeds: [n], files: [] }).catch(() => { });
  } else if (s.loadType === "TRACK_LOADED") {
    if (player.state !== "CONNECTED") player.connect();
    if (player) player.queue.add(s.tracks[0]);
    if (
      player &&
      player.state === "CONNECTED" &&
      !player.playing &&
      !player.paused &&
      !player.queue.size
    )
      return await player.play();

    await message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setDescription(
              `Added [${s.tracks[0].title}](${s.tracks[0].uri}) to the queue.`
            ),
        ],
      })
      .then((a) =>
        setTimeout(async () => await a.delete().catch(() => { }), 5000)
      )
      .catch(() => { });

    neb(n, player);
    if (m) await m.edit({ embeds: [n] }).catch(() => { });
  } else return await oops(message.channel, `No results found for ${query}`);
}

/**
 *
 * @param {String} msgId
 * @param {TextChannel} channel
 * @param {Player} player
 * @param {import("erela.js").Track} track
 * @param {Client} client
 */

async function trackStartEventHandler(msgId, channel, player, track, client) {
  try {
    const emojiplay = client.emoji.play;
    let id;
    if (player.queue.current === null) id = player.get("dcQ");
    id = player.queue.current;
    let icon = id.identifier
      ? `https://img.youtube.com/vi/${id.identifier}/maxresdefault.jpg`
      : client.config.links.img;

    let message;
    try {
      message = await channel.messages.fetch({ message: msgId, cache: true });
    } catch (error) {
      console.log(error);
    }

    if (!message) {
      let embed1 = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          `[${track.title}](${track.uri}) by ${track.author} - \`[${convertTime(
            track.duration
          )}]\``
        )
        .setImage(icon)
        .setFooter({
          text: `Requested by ${player.queue.current.requester.username}`,
          iconURL: player.queue.current.requester?.displayAvatarURL({ dynamic: true }),
        });

      let pausebut = new ButtonBuilder()
        .setCustomId(`pause_but_${player.guild}`)
        .setEmoji({ name: "⏸️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      let lowvolumebut = new ButtonBuilder()
        .setCustomId(`lowvolume_but_${player.guild}`)
        .setEmoji({ name: "🔉" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      let highvolumebut = new ButtonBuilder()
        .setCustomId(`highvolume_but_${player.guild}`)
        .setEmoji({ name: "🔊" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      let previousbut = new ButtonBuilder()
        .setCustomId(`previous_but_${player.guild}`)
        .setEmoji({ name: "⏮️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      let skipbut = new ButtonBuilder()
        .setCustomId(`skipbut_but_${player.guild}`)
        .setEmoji({ name: "⏭️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      const row1 = new ActionRowBuilder().addComponents(
        lowvolumebut,
        previousbut,
        pausebut,
        skipbut,
        highvolumebut
      );
      const m = await channel.send({
        content:
          "__**Join a voice channel and queue songs by name/url.**__\n\n",
        embeds: [embed1],
        components: [row1],
      });

      return await db.findOneAndUpdate(
        { Guild: channel.guildId },
        { Message: m.id }
      );
    } else {
      let embed2 = new EmbedBuilder()
        .setColor(message.client.embedColor)
        .setDescription(
          `${emojiplay} **Started Playing** - [${track.title}](${track.uri
          }) by ${track.author} - \`[${convertTime(track.duration)}]\``
        )
        .setImage(icon)
        .setFooter({
          text: `Requested by ${player.queue?.current.requester?.username ?? "Autoplay"
            }`,
          iconURL: player.queue.current.requester?.displayAvatarURL({
            dynamic: true,
          }),
        });

      await message.edit({
        content: "__**Join a voice channel and queue songs by name/url.**__\n",
        embeds: [embed2],
      });
    }
  } catch (error) {
    return console.error(error);
  }
}
/**
 *
 * @param {ButtonInteraction} int
 * @param {String} args
 * @param {Client} client
 */

async function buttonReply(int, args, client) {
  if (int.replied) {
    await int.editReply({
      embeds: [
        new EmbedBuilder().setColor(int.client.embedColor).setDescription(args),
      ],
    });
  } else {
    await int.followUp({
      embeds: [
        new EmbedBuilder().setColor(int.client.embedColor).setDescription(args),
      ],
    });
  }

  setTimeout(async () => {
    if (int && !int.ephemeral) {
      await int.deleteReply().catch(() => { });
    }
  }, 2000);
}

module.exports = {
  playerhandler,
  trackStartEventHandler,
  buttonReply,
  oops,
  AutoConnect,
};
