const {
  MessageEmbed,
  CommandInteraction,
  Client,
  Permissions,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.grab.name"),
  description: i18n.__("cmd.grab.des"),
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    let player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("#FFC942")
        .setDescription(i18n.__("player.nomusic"));
      return interaction.reply({ embeds: [thing] });
    }

    const song = player.queue.current;
    const total = song.duration;
    const current = player.position;

    const dmbut = new MessageButton()
      .setLabel(i18n.__("cmd.grab.label"))
      .setStyle("LINK")
      .setURL(`https://discord.com/users/${client.id}`);
    const row = new MessageActionRow().addComponents(dmbut);

    let dm = new MessageEmbed()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(`:mailbox_with_mail: \`${i18n.__("cmd.grab.label")}\``)
      .setColor(client.embedColor)
      .setFooter({
        text: `${i18n.__("cmd.grab.footer")} ${interaction.user.tag}`,
      })
      .setTimestamp();
    interaction.reply({ embeds: [dm], components: [row] });
    const user = client.users.cache.get(interaction.member.user.id);

    const urlbutt = new MessageButton()
      .setLabel(i18n.__("cmd.grab.search"))
      .setStyle("LINK")
      .setURL(song.uri);
    const row2 = new MessageActionRow().addComponents(urlbutt);
    let embed = new MessageEmbed()
      .setDescription(
        `${i18n.__("cmd.grab.details")} \n\n > ${i18n.__("cmd.grab.sname")}: [${
          song.title
        }](${song.uri}) \n > ${i18n.__("cmd.grab.time")}: \`[${convertTime(
          song.duration
        )}]\` \n > ${i18n.__("cmd.grab.playedby")}: [<@${
          song.requester.id
        }>] \n > ${i18n.__("cmd.grab.savedby")}: [<@${message.author.id}>]`
      )
      .setThumbnail(song.displayThumbnail())
      .setColor(client.embedColor)
      .addField(
        "\u200b",
        `\`${convertTime(current)} / ${convertTime(total)}\``
      );
    return user.send({ embeds: [embed], components: [row2] });
  },
};
