const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  CommandInteraction,
  Client,
} = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.help.name"),
  description: i18n.__("cmd.help.des"),
  owner: false,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const embed = new MessageEmbed()
      .setTitle(i18n.__mf("cmd.help.title", { bot: client.user.username }))
      .setDescription(
        i18n.__mf("cmd.help.main", {
          user: interaction.member.user.id,
          bot: client.user.id,
        })
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.embedColor)
      .setTimestamp()
      .setFooter({
        text: `${i18n.__("cmd.help.footer")} ${
          interaction.member.user.username
        }`,
        iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
      });

    let but1 = new MessageButton()
      .setCustomId("home")
      .setLabel(i18n.__("cmd.help.label"))
      .setStyle("SUCCESS");

    let but2 = new MessageButton()
      .setCustomId("music")
      .setLabel(i18n.__("cmd.help.label2"))
      .setStyle("PRIMARY");

    let but3 = new MessageButton()
      .setCustomId("info")
      .setLabel(i18n.__("cmd.help.label3"))
      .setStyle("PRIMARY");

    let but4 = new MessageButton()
      .setCustomId("config")
      .setLabel(i18n.__("cmd.help.label4"))
      .setStyle("PRIMARY");

    let _commands;
    let editEmbed = new MessageEmbed();

    await interaction.editReply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(but1, but2, but3, but4),
      ],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id === interaction.member.user.id) return true;
        else {
          b.reply({
            ephemeral: true,
            content: i18n.__mf("button.wrongbut", {
              Tag: interaction.member.user.tag,
            }),
          });
          return false;
        }
      },
      time: 60000,
      idle: 60000 / 2,
    });
    collector.on("end", async () => {
      await interaction
        .editReply({
          components: [
            new MessageActionRow().addComponents(
              but1.setDisabled(true),
              but2.setDisabled(true),
              but3.setDisabled(true),
              but4.setDisabled(true)
            ),
          ],
        })
        .catch(() => {});
    });
    collector.on("collect", async (b) => {
      if (!b.deferred) await b.deferUpdate();
      if (b.customId === "home") {
        return await interaction.editReply({
          embeds: [embed],
          components: [
            new MessageActionRow().addComponents(but1, but2, but3, but4),
          ],
        });
      }
      if (b.customId === "music") {
        _commands = client.commands
          .filter((x) => x.category && x.category === "Music")
          .map((x) => `\`${x.name}\``);
        editEmbed
          .setColor(client.embedColor)
          .setDescription(_commands.join(", "))
          .setTitle(i18n.__("cmd.help.but.title"))
          .setFooter({
            text: i18n.__mf("cmd.help.but.footer", { cmd: _commands.length }),
          });

        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new MessageActionRow().addComponents(but1, but2, but3, but4),
          ],
        });
      }
      if (b.customId == "info") {
        _commands = client.commands
          .filter((x) => x.category && x.category === "Information")
          .map((x) => `\`${x.name}\``);
        editEmbed
          .setColor(client.embedColor)
          .setDescription(_commands.join(", "))
          .setTitle(i18n.__("cmd.help.but.title2"))
          .setFooter({
            text: i18n.__mf("cmd.help.but.footer2", { cmd: _commands.length }),
          });
        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new MessageActionRow().addComponents(but1, but2, but3, but4),
          ],
        });
      }
      if (b.customId == "config") {
        _commands = client.commands
          .filter((x) => x.category && x.category === "Config")
          .map((x) => `\`${x.name}\``);
        editEmbed
          .setColor(client.embedColor)
          .setDescription(_commands.join(", "))
          .setTitle(i18n.__("cmd.help.but.title3"))
          .setFooter({
            text: i18n.__mf("cmd.help.but.footer3", { cmd: _commands.length }),
          });
        return await interaction.editReply({
          embeds: [editEmbed],
          components: [
            new MessageActionRow().addComponents(but1, but2, but3, but4),
          ],
        });
      }
    });
  },
};
