const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const { convertTime } = require("../../utils/convert.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.queue.name"),
  description: i18n.__("cmd.queue.des"),
  options: [
    {
      name: i18n.__("cmd.queue.slash.name"),
      type: "NUMBER",
      required: false,
      description: i18n.__("cmd.queue.slash.des"),
    },
  ],
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply().catch(() => { });

    const player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current;

    if (!player.queue.current)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(i18n.__("player.noplaying")),
        ],
      });

    if (!player.queue.size || player.queue.size === 0) {
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

      await interaction.editReply({
        embeds: [embed],
      });
    } else {
      const mapping = player.queue.map(
        (t, i) =>
          `\` ${++i} \` • [${t.title}](${t.uri}) • \`[ ${convertTime(
            t.duration
          )} ]\` • [${t.requester}]`
      );

      const chunk = load.chunk(mapping, 10);
      const pages = chunk.map((s) => s.join("\n"));
      let page = interaction.options.getNumber("page");
      if (!page) page = 0;
      if (page) page = page - 1;
      if (page > pages.length) page = 0;
      if (page < 0) page = 0;

      if (player.queue.size < 10 || player.queue.totalSize < 10) {
        const embed2 = new MessageEmbed()
          .setTitle(
            `${interaction.guild.name} ${i18n.__("cmd.queue.slash.title")}`
          )
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
          .setFooter({
            text: `${i18n.__mf("cmd.queue.page")} ${page + 1}/${pages.length}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed2] });
      } else {
        const embed3 = new MessageEmbed()
          .setTitle(`${interaction.guild.name} ${i18n.__mf("cmd.queue.title")}`)
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
          .setFooter({
            text: `${i18n.__mf("cmd.queue.page")} ${page + 1}/${pages.length}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(player.queue.current.thumbnail)
          .setTimestamp();

        const but1 = new MessageButton()
          .setCustomId("queue_cmd_but_1_app")
          .setEmoji("⏭️")
          .setStyle("PRIMARY");

        const dedbut1 = new MessageButton()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_1_app")
          .setEmoji("⏭️")
          .setStyle("SECONDARY");

        const but2 = new MessageButton()
          .setCustomId("queue_cmd_but_2_app")
          .setEmoji("⏮️")
          .setStyle("PRIMARY");

        const dedbut2 = new MessageButton()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_2_app")
          .setEmoji("⏮️")
          .setStyle("SECONDARY");

        const but3 = new MessageButton()
          .setCustomId("queue_cmd_but_3_app")
          .setEmoji("⏹️")
          .setStyle("DANGER");

        const dedbut3 = new MessageButton()
          .setDisabled(true)
          .setCustomId("queue_cmd_ded_but_3_app")
          .setEmoji("⏹️")
          .setStyle("SECONDARY");

        await interaction.editReply({
          embeds: [embed3],
          components: [
            new MessageActionRow().addComponents([but2, but3, but1]),
          ],
        });

        const collector = interaction.channel.createMessageComponentCollector({
          filter: (b) => {
            if (b.user.id === interaction.user.id) return true;
            else
              return b.reply({
                ephemeral: true,
                content: i18n.__mf("button.wrongbut", {
                  Tag: interaction.user.tag,
                }),
              });
          },
          time: 60000 * 5,
          idle: 30e3,
        });

        collector.on("collect", async (button) => {
          if (button.customId === "queue_cmd_but_1_app") {
            await button.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

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
              .setFooter({
                text: `Page ${page + 1}/${pages.length}`,
                iconURL: button.user.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed4],
              components: [
                new MessageActionRow().addComponents([but2, but3, but1]),
              ],
            });
          } else if (button.customId === "queue_cmd_but_2_app") {
            await button.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed5 = new MessageEmbed()
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
              .setFooter({
                Text: `Page ${page + 1}/${pages.length}`,
                iconURL: button.user.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed5],
              components: [
                new MessageActionRow().addComponents([but2, but3, but1]),
              ],
            });
          } else if (button.customId === "queue_cmd_but_3_app") {
            await button.deferUpdate().catch(() => { });
            await collector.stop();
          } else return;
        });

        collector.on("end", async () => {
          await interaction.editReply({
            embeds: [embed3],
            components: [
              new MessageActionRow().addComponents([dedbut2, dedbut3, dedbut1]),
            ],
          });
        });
      }
    }
  },
};
