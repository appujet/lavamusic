const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const { convertTime } = require("../../utils/convert.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.queue.name"),
  category: "Music",
  aliases: i18n.__("cmd.queue.aliases"),
  description: i18n.__("cmd.queue.des"),
  args: false,
  usage: i18n.__("cmd.queue.use"),
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {

    const player = client.manager.get(message.guild.id);
    const song = player.queue.current;

    if (!player)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(i18n.__("player.noplaying")),
        ],
      });

    if (!player.queue.current)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(i18n.__("player.noplaying")),
        ],
      });

    if (player.queue.length === "0" || !player.queue.length) {
      const embed = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(
          i18n.__mf("cmd.queue.embed", {
            SongTitle: song.title,
            SongUrl: song.uri,
            SongTime: convertTime(song.duration),
            SongReq: song.requester,
          })
        );

      await message.channel.send({ embeds: [embed] });
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
        const embed = new MessageEmbed()
          .setColor(client.embedColor)
          .setDescription(
            i18n.__mf("cmd.queue.embed2", {
              SongTitle: song.title,
              SongUrl: song.uri,
              SongTime: convertTime(song.duration),
              SongReq: song.requester,
              Page: pages[page],
            })
          )
          .setTimestamp()
          .setFooter({
            text: `${i18n.__mf("cmd.queue.page")} ${page + 1}/${pages.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTitle(`${message.guild.name} ${i18n.__mf("cmd.queue.title")}`);

        await message.channel.send({
          embeds: [embed],
        });
      } else {
        const embed2 = new MessageEmbed()
          .setColor(client.embedColor)
          .setDescription(
            i18n.__mf("cmd.queue.embed2", {
              SongTitle: song.title,
              SongUrl: song.uri,
              SongTime: convertTime(song.duration),
              SongReq: song.requester,
              Page: pages[page],
            })
          )
          .setTimestamp()
          .setFooter({
            text: `${i18n.__("cmd.queue.footer")} ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTitle(`${message.guild.name} ${i18n.__mf("cmd.queue.title")}`);

        const but1 = new MessageButton()
          .setCustomId("queue_cmd_but_1")

          .setEmoji("⏭")
          .setStyle("PRIMARY");

        const but2 = new MessageButton()
          .setCustomId("queue_cmd_but_2")
          .setEmoji("⏮")
          .setStyle("PRIMARY");

        const but3 = new MessageButton()
          .setCustomId("queue_cmd_but_3")
          .setLabel(`${page + 1}/${pages.length}`)
          .setStyle("SECONDARY")
          .setDisabled(true);

        const row1 = new MessageActionRow().addComponents([but2, but3, but1]);

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
                content: i18n.__mf("button.wrongbut", {
                  Tag: message.author.tag,
                }),
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

            const embed3 = new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(
                i18n.__mf("cmd.queue.embed2", {
                  SongTitle: song.title,
                  SongUrl: song.uri,
                  SongTime: convertTime(song.duration),
                  SongReq: song.requester,
                  Page: pages[page],
                })
              )
              .setTimestamp()
              .setFooter({
                text: `${i18n.__("cmd.queue.footer")} ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTitle(
                `${message.guild.name} ${i18n.__mf("cmd.queue.title")}`
              );

            await msg.edit({
              embeds: [embed3],
              components: [
                new MessageActionRow().addComponents(
                  but2,
                  but3.setLabel(`${page + 1}/${pages.length}`),
                  but1
                ),
              ],
            });
          } else if (button.customId === "queue_cmd_but_2") {
            await button.deferUpdate().catch(() => {});
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(
                i18n.__mf("cmd.queue.embed2", {
                  SongTitle: song.title,
                  SongUrl: song.uri,
                  SongTime: convertTime(song.duration),
                  SongReq: song.requester,
                  Page: pages[page],
                })
              )
              .setTimestamp()
              .setFooter({
                text: `${i18n.__("cmd.queue.footer")} ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTitle(
                `${message.guild.name} ${i18n.__mf("cmd.queue.title")}`
              );

            await msg.edit({
              embeds: [embed4],
              components: [
                new MessageActionRow().addComponents(
                  but2,
                  but3.setLabel(
                    `${i18n.__("cmd.queue.page")} ${page + 1}/${pages.length}`
                  ),
                  but1
                ),
              ],
            });
          } else return;
        });

        collector.on("end", async () => {
          await msg.edit({
            components: [],
          });
        });
      }
    }
  },
};
