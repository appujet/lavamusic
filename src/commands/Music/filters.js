const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.filter.name"),
  category: "Music",
  aliases: i18n.__("cmd.filter.aliases"),
  description: i18n.__("cmd.filter.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);
    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return message.reply({ embeds: [thing] });
    }
    const emojiequalizer = client.emoji.filter;
    const embed = new MessageEmbed()
      .setColor(client.embedColor)
      .setDescription(i18n.__("cmd.filter.filinfo"));

    const but = new MessageButton()
      .setCustomId("clear_but")
      .setLabel(i18n.__("cmd.filter.but1"))
      .setStyle("DANGER");
    const but2 = new MessageButton()
      .setCustomId("bass_but")
      .setLabel(i18n.__("cmd.filter.but2"))
      .setStyle("PRIMARY");
    const but3 = new MessageButton()
      .setCustomId("night_but")
      .setLabel(i18n.__("cmd.filter.but3"))
      .setStyle("PRIMARY");
    const but4 = new MessageButton()
      .setCustomId("picth_but")
      .setLabel(i18n.__("cmd.filter.but4"))
      .setStyle("PRIMARY");
    const but5 = new MessageButton()
      .setCustomId("distort_but")
      .setLabel(i18n.__("cmd.filter.but5"))
      .setStyle("PRIMARY");
    const but6 = new MessageButton()
      .setCustomId("eq_but")
      .setLabel(i18n.__("cmd.filter.but6"))
      .setStyle("PRIMARY");
    const but7 = new MessageButton()
      .setCustomId("8d_but")
      .setLabel(i18n.__("cmd.filter.but7"))
      .setStyle("PRIMARY");
    const but8 = new MessageButton()
      .setCustomId("boost_but")
      .setLabel(i18n.__("cmd.filter.but8"))
      .setStyle("PRIMARY");
    const but9 = new MessageButton()
      .setCustomId("speed_but")
      .setLabel(i18n.__("cmd.filter.but9"))
      .setStyle("PRIMARY");
    const but10 = new MessageButton()
      .setCustomId("vapo_but")
      .setLabel(i18n.__("cmd.filter.but10"))
      .setStyle("PRIMARY");

    const row = new MessageActionRow().addComponents(
      but,
      but2,
      but3,
      but4,
      but5
    );
    const row2 = new MessageActionRow().addComponents(
      but6,
      but7,
      but8,
      but9,
      but10
    );

    const m = await message.reply({ embeds: [embed], components: [row, row2] });

    const embed1 = new MessageEmbed().setColor(client.embedColor);
    const collector = m.createMessageComponentCollector({
      filter: (f) =>
        f.user.id === message.author.id
          ? true
          : false && f.deferUpdate().catch(() => {}),
      time: 60000,
      idle: 60000 / 2,
    });
    collector.on("end", async () => {
      if (!m) return;
      await m.edit({
        embeds: [
          embed1.setDescription(i18n.__mf("cmd.filter.tout", { Pre: prefix })),
        ],
      });
    });
    collector.on("collect", async (b) => {
      if (!b.replied) await b.deferUpdate({ ephemeral: true });
      if (b.customId === "clear_but") {
        await player.clearEffects();
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em1")}`
            ),
          ],
        });
      } else if (b.customId === "bass_but") {
        await player.setBassboost(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em2")}`
            ),
          ],
        });
      } else if (b.customId === "night_but") {
        await player.setNightcore(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em3")}`
            ),
          ],
        });
      } else if (b.customId === "picth_but") {
        await player.setPitch(2);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em4")}`
            ),
          ],
        });
      } else if (b.customId === "distort_but") {
        await player.setDistortion(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em5")}`
            ),
          ],
        });
      } else if (b.customId === "eq_but") {
        await player.setEqualizer(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em6")}`
            ),
          ],
        });
      } else if (b.customId === "8d_but") {
        await player.set8D(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em7")}`
            ),
          ],
        });
      } else if (b.customId === "boost_but") {
        var bands = new Array(7)
          .fill(null)
          .map((_, i) => ({ band: i, gain: 0.25 }));
        await player.setEQ(...bands);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em8")}`
            ),
          ],
        });
      } else if (b.customId === "speed_but") {
        await player.setSpeed(2);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em9")}`
            ),
          ],
        });
      } else if (b.customId === "vapo_but") {
        await player.setVaporwave(true);
        if (m) await m.edit({ embeds: [embed], components: [row, row2] });
        return await b.editReply({
          embeds: [
            embed1.setDescription(
              `${emojiequalizer} ${i18n.__("cmd.filter.em10")}`
            ),
          ],
        });
      }
    });
  },
};
