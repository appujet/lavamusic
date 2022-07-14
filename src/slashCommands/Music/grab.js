const { EmbedBuilder, CommandInteraction, Client, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
  name: "grab",
  description: "Grabs and sends you the Song that is playing at the Moment",
  userPrems: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    let player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current
    const total = song.duration;
    const current = player.position;

    const dmbut = new ButtonBuilder().setLabel("Check Your DM").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${client.id}`)
    const row = new ActionRowBuilder().addComponents(dmbut)

    let dm = new EmbedBuilder()
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
    .setDescription(`:mailbox_with_mail: \`Check Your DMs!\``)
    .setColor(client.embedColor)
    .setFooter({text: `Requested By ${interaction.user.tag}`})
    .setTimestamp()
    interaction.reply({embeds: [dm], components: [row]})
    const user = client.users.cache.get(interaction.member.user.id);
    const urlbutt = new ButtonBuilder().setLabel("Search").setStyle(ButtonStyle.Link).setURL(song.uri)
    const row2 = new ActionRowBuilder().addComponents(urlbutt)
    let embed = new EmbedBuilder()
        .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${convertTime(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${interaction.user.id}>]`)
        .setThumbnail(song.displayThumbnail())
        .setColor(client.embedColor)
        .addFields([
            { name: "\u200b", value: `\`${convertTime(current)} / ${convertTime(total)}\`` }
        ])
     return user.send({embeds: [embed], components: [row2]})

   }
};
