const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, CommandInteraction, ButtonStyle, Client } = require("discord.js");

module.exports = {
    name: "help",
    description: "Help with all commands, or one specific command.",
    owner: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
          ephemeral: false
        });
  const embed = new EmbedBuilder()
    .setTitle(`${client.user.username} Help`)
    .setDescription(`Hey**<@${interaction.member.user.id}>**, I'm <@${client.user.id}>!\n\nA Discord music bot with many awesome features with support for many sources!\n\n\`🎵\`•Music\n\`🗒️\`•Information\n\`💽\`•Playlists\n\`⚙️\`•Config\n\n*Choose an category below button to see commands.*\n\n`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(client.embedColor)
    .setTimestamp()
    .setFooter({ text: `Requested by: ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true})})
    
    let but1 = new ButtonBuilder().setCustomId("home").setLabel("Home").setStyle(ButtonStyle.Success)
  
    let but2 = new ButtonBuilder().setCustomId("music").setLabel("Music").setStyle(ButtonStyle.Primary)
  
    let but3 = new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Primary);

    let but4 = new ButtonBuilder().setCustomId("playlist").setLabel("Playlist").setStyle(ButtonStyle.Primary);

    let but5 = new ButtonBuilder().setCustomId("config").setLabel("Config").setStyle(ButtonStyle.Primary);

     let _commands;
     let editEmbed = new EmbedBuilder();
     
     await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (b) => {
      if(b.user.id === interaction.member.user.id) return true;
       else {
     b.reply({ ephemeral: true, content: `Only **${interaction.member.user.username}** can use this button, run the command again to use the help menu.`}); return false;
           };
      },
      time : 60000,
      idle: 60000/2
    });
    collector.on("end", async () => {
        await interaction.editReply({ components: [new ActionRowBuilder().addComponents(but1.setDisabled(true), but2.setDisabled(true), but3.setDisabled(true), but4.setDisabled(true),  but5.setDisabled(true))] }).catch(() => {});
     });
    collector.on('collect', async (b) => {
      if(!b.deferred) await b.deferUpdate()
         if(b.customId === "home") {
           return await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4,  but5)] })
        }
        if(b.customId === "music") {
         _commands = client.commands.filter((x) => x.category && x.category === "Music").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Music Commands").setFooter({text: `Total ${_commands.length} music commands.`});
 
           return await interaction.editReply({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
        }
         if(b.customId == "info") {
         _commands = client.commands.filter((x) => x.category && x.category === "Information").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Information Commands").setFooter({text: `Total ${_commands.length} information commands.`})
          return await interaction.editReply({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
         }
         if(b.customId == "playlist") {
          _commands = client.commands.filter((x) => x.category && x.category === "Playlist").map((x) => `\`${x.name}\``);
              editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Playlist Commands").setFooter({text: `Total ${_commands.length} playlist commands.`})
           return await interaction.editReply({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4,  but5)] })
          }
         if(b.customId == "config") {
         _commands = client.commands.filter((x) => x.category && x.category === "Config").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Config Commands").setFooter({text: `Total ${_commands.length} config commands.`})
          return await interaction.editReply({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4,  but5)] })
         
        }
     });
   }
 }
