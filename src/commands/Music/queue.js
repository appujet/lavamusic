const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const load = require("lodash");
const { convertTime } = require("../../utils/convert.js");

module.exports = {
  name: "queue",
  category: "Music",
  aliases: ["q"],
  description: "Displays the music queue and current song.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.get(message.guild.id);
    const queue = player.queue;

    if (!player.queue.current)
      return message.reply({
        content: `Please play a song before running this command.`,
      });
    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(`Nothing is playing right now.`),
        ],
      });

    if (!player.queue)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(`Nothing is playing right now.`),
        ],
      });

    if (player.queue.length === "0" || !player.queue.length) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          `Now Playing [${player.queue.current.title}](${
            player.queue.current.uri
          }) • \`[${convertTime(queue.current.duration)}]\` • [${
            player.queue.current.requester
          }]`
        );

      await message.channel
        .send({
          embeds: [embed],
        })
        .catch(() => {});
    } else {
      const queuedSongs = player.queue.map(
        (t, i) =>
          `\`${++i}\` • ${t.title} • \`[${convertTime(t.duration)}]\` • [${
            t.requester
          }]`
      );

      const mapping = load.chunk(queuedSongs, 10);
      const pages = mapping.map((s) => s.join("\n"));
      let page = 0;

      if (player.queue.size < 11) {
        const embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `**Now Playing**\n > [${player.queue.current.title}](${
              player.queue.current.uri
            }) • \`[${convertTime(queue.current.duration)}]\`  • [${
              player.queue.current.requester
            }]\n\n**Queued Songs**\n${pages[page]}`
          )
          .setTimestamp()
          .setFooter({
            text: `Page ${page + 1}/${pages.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTitle(`${message.guild.name} Queue`);

        await message.channel.send({
          embeds: [embed],
        });
      } else {
        const embed2 = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `**Now Playing**\n > [${player.queue.current.title}](${
              player.queue.current.uri
            }) • \`[${convertTime(queue.current.duration)}]\` • [${
              player.queue.current.requester
            }]\n\n**Queued Songs**\n${pages[page]}`
          )
          .setTimestamp()
          .setFooter({
            text: `Page ${page + 1}/${pages.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTitle(`${message.guild.name} Queue`);

        const but1 = new ButtonBuilder()
          .setCustomId("queue_cmd_but_1")
          .setEmoji({ name: "⏭️" })
          .setStyle(ButtonStyle.Primary);

        const dedbut1 = new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_1_app")
          .setEmoji("⏭️")
          .setStyle(ButtonStyle.Primary);

        const but2 = new ButtonBuilder()
          .setCustomId("queue_cmd_but_2_app")
          .setEmoji({ name: "⏮️" })
          .setStyle(ButtonStyle.Primary);

        const dedbut2 = new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_2_app")
          .setEmoji({ name: "⏮️" })
          .setStyle(ButtonStyle.Primary);

        const but3 = new ButtonBuilder()
          .setCustomId("queue_cmd_but_3_app")
          .setEmoji({ name: "⏹️" })
          .setStyle(ButtonStyle.Danger);

        const dedbut3 = new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_3_app")
          .setEmoji({ name: "⏹️" })
          .setStyle(ButtonStyle.Primary);

        const row1 = new ActionRowBuilder().addComponents([but2, but3, but1]);

        const msg = await message.channel.send({
          embeds: [embed2],
          components: [row1],
        });

        const collector = message.channel.createMessageComponentCollector({
          filter: (b) => {
            if (b.user.id === message.author.id) return true;
            else {
              b.reply({
                ephemeral: true,
                content: `Only **${message.author.tag}** can use this button, run the command again to use the queue menu.`,
              });
              return false;
            }
          },
          time: 60000 * 5,
          idle: 30e3,
        });

        collector.on("collect", async (button) => {
          if (button.customId === "queue_cmd_but_1") {
            await button.deferUpdate().catch(() => {});
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `**Now Playing**\n[${player.queue.current.title}](${
                  player.queue.current.uri
                }) • \`[${convertTime(queue.current.duration)}]\` • [${
                  player.queue.current.requester
                }]\n\n**Queued Songs**\n${pages[page]}`
              )
              .setTimestamp()
              .setFooter({
                text: `Page ${page + 1}/${pages.length}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTitle(`${message.guild.name} Queue`);

            await msg.edit({
              embeds: [embed3],
              components: [
                new ActionRowBuilder().addComponents([but2, but3, but1]),
              ],
            });
          } else if (button.customId === "queue_cmd_but_2_app") {
            await button.deferUpdate().catch(() => {});
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `**Now Playing**\n[${player.queue.current.title}](${
                  player.queue.current.uri
                }) • \`[${convertTime(queue.current.duration)}]\` • [${
                  player.queue.current.requester
                }]\n\n**Queued Songs**\n${pages[page]}`
              )
              .setTimestamp()
              .setFooter({
                text: `Page ${page + 1}/${pages.length}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTitle(`${message.guild.name} Queue`);

            await msg
              .edit({
                embeds: [embed4],
                components: [
                  new ActionRowBuilder().addComponents([but2, but3, but1]),
                ],
              })
              .catch(() => {});
          } else if (button.customId === "queue_cmd_but_3_app") {
            await button.deferUpdate().catch(() => {});
            await collector.stop();
          } else return;
        });

        collector.on("end", async () => {
          await msg.edit({
            embeds: [embed2],
            components: [
              new ActionRowBuilder().addComponents([dedbut2, dedbut3, dedbut1]),
            ],
          });
        });
      }
    }
  },
};
