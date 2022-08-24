const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "help",
    category: "Information",
    aliases: [ "h" ],
    description: "Help with all commands, or one specific command.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
 execute: async (message, args, client, prefix) => {

  const embed = new EmbedBuilder()
    .setTitle(`${client.user.username} Help`)
    .setDescription(`Hey**<@${message.author.id}>**, I'm <@${client.user.id}>!\n\nA Discord music bot with many awesome features with support for many sources!\n\n\`🎵\`•Music\n\`🗒️\`•Information\n\`💽\`•Playlists\n\`⚙️\`•Config\n\n*Choose an category below button to see commands.*\n\n`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(client.embedColor)
    .setTimestamp()
    .setFooter({text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                
    let but1 = new ButtonBuilder().setCustomId("home").setLabel("Home").setStyle(ButtonStyle.Success)
  
    let but2 = new ButtonBuilder().setCustomId("music").setLabel("Music").setStyle(ButtonStyle.Primary)
  
    let but3 = new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Primary);
    
    let but4 = new ButtonBuilder().setCustomId("playlist").setLabel("Playlist").setStyle(ButtonStyle.Primary);

    let but5 = new ButtonBuilder().setCustomId("config").setLabel("Config").setStyle(ButtonStyle.Primary);

     let _commands;
     let editEmbed = new EmbedBuilder();
     
    const m = await message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] });

    const collector = m.createMessageComponentCollector({
      filter: (b) => {
      if(b.user.id === message.author.id) return true;
       else {
     b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, run the command again to use the help menu.`}); return false;
           };
      },
      time : 60000,
      idle: 60000/2
    });
    collector.on("end", async () => {
		 if(!m) return;
        await m.edit({ components: [new ActionRowBuilder().addComponents(but1.setDisabled(true), but2.setDisabled(true), but3.setDisabled(true), but4.setDisabled(true),  but5.setDisabled(true))] }).catch(() => {});
    });
    collector.on('collect', async (b) => {
       if(!b.deferred) await b.deferUpdate()
        if(b.customId === "home") {
           if(!m) return;
           return await m.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
        }
        if(b.customId === "music") {
         _commands = client.commands.filter((x) => x.category && x.category === "Music").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Music Commands").setFooter({text: `Total ${_commands.length} music commands.`});
           if(!m) return;
           return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
        }
         if(b.customId == "info") {
         _commands = client.commands.filter((x) => x.category && x.category === "Information").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Information Commands").setFooter({text: `Total ${_commands.length} information commands.`})
          return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
         }
         if(b.customId == "playlist") {
          _commands = client.commands.filter((x) => x.category && x.category === "Playlist").map((x) => `\`${x.name}\``);
              editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Playlist Commands").setFooter({text: `Total ${_commands.length} playlist commands.`})
           return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
          }
         if(b.customId == "config") {
         _commands = client.commands.filter((x) => x.category && x.category === "Config").map((x) => `\`${x.name}\``);
             editEmbed.setColor(client.embedColor).setDescription(_commands.join(", ")).setTitle("Config Commands").setFooter({text: `Total ${_commands.length} config commands.`})
          return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3, but4, but5)] })
         
        }
     });
   }
 }
