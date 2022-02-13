const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.help.name"),
  category: "Information",
  aliases: i18n.__("cmd.help.aliases"),
  description: i18n.__("cmd.help.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const embed = new MessageEmbed()
      .setTitle(i18n.__mf("cmd.help.title", { bot: client.user.username }))
      .setDescription(
        i18n.__mf("cmd.help.main", {
          user: message.author.id,
          bot: client.user.id,
        })
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.embedColor)
      .setTimestamp()
      .setFooter({
        text: `${i18n.__("cmd.help.footer")} ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

    const m = await message.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(but1, but2, but3, but4),
      ],
    });

    const collector = m.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id === message.author.id) return true;
        else {
          b.reply({
            ephemeral: true,
            content: i18n.__mf("button.wrongbut", { Tag: message.author.tag }),
          });
          return false;
        }
      },
      time: 60000,
      idle: 60000 / 2,
    });
    collector.on("end", async () => {
      if (!m) return;
      await m.edit({
        components: [
          new MessageActionRow().addComponents(
            but1.setDisabled(true),
            but2.setDisabled(true),
            but3.setDisabled(true),
            but4.setDisabled(true)
          ),
        ],
      });
    });
    collector.on("collect", async (b) => {
      if (!b.deferred) await b.deferUpdate();
      if (b.customId === "home") {
        if (!m) return;
        return await m.edit({
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
        if (!m) return;
        return await m.edit({
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
        return await m.edit({
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
        return await m.edit({
          embeds: [editEmbed],
          components: [
            new MessageActionRow().addComponents(but1, but2, but3, but4),
          ],
        });
      }
    });
  },
};
