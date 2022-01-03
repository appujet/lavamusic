const { MessageEmbed, CommandInteraction, Client, Permissions, MessageButton, MessageActionRow } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
  name: "grab",
  description: "Grabs And Sends You The Song That Is Playing At The Moment",
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
   
    if(!interaction.member.voice.channel) return interaction.editReply({embeds: [new MessageEmbed ().setColor(client.embedColor).setDescription("You are not connect in vc")]});

    let player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
        let thing = new MessageEmbed()
        .setColor("#FFC942")
        .setDescription("There is no music playing.");
        return interaction.reply({embeds: [thing]});
    }

    const song = player.queue.current
    const total = song.duration;
    const current = player.position;

    const dmbut = new MessageButton().setLabel("Check Your Dm").setStyle("LINK").setURL(`https://discord.com/users/${client.id}`)
    const row = new MessageActionRow().addComponents(dmbut)

    let dm = new MessageEmbed()
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
    .setDescription(`:mailbox_with_mail: \`Check Your Dms!\``)
    .setColor(client.embedColor)
    .setFooter({text: `Requested By ${interaction.user.tag}`})
    .setTimestamp()
    interaction.reply({embeds: [dm], components: [row]})
    const user = client.users.cache.get(interaction.member.user.id);
    const urlbutt = new MessageButton().setLabel("Search").setStyle("LINK").setURL(song.uri)
    const row2 = new MessageActionRow().addComponents(urlbutt)
    let embed = new MessageEmbed()
        .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${convertTime(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${interaction.user.id}>]`)
        .setThumbnail(song.displayThumbnail())
        .setColor(client.embedColor)
        .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
     return user.send({embeds: [embed], components: [row2]})

   }
};
