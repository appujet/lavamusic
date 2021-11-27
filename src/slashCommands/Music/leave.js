const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "leave",
  description: "Leave voice channel",

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
      if(!interaction.member.voice.channel) return interaction.editReply({embeds: [new MessageEmbed ().setColor(client.embedColor).setDescription("You are not connect in vc")]});
      if(interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) return interaction.editReply({embeds: [new MessageEmbed ().setColor(client.embedColor).setDescription(`You are not connected to <#${interaction.guild.me.voice.channelId}> to use this command.`)]});

    const player = client.manager.get(interaction.guildId);
   
    const emojiLeave = client.emoji.leave;
        
        player.destroy();
        
        let thing = new MessageEmbed()
          .setColor(client.embedColor)
          .setDescription(`${emojiLeave} **Leave the voice channel**\nThank you for using ${interaction.client.user.username}!`)
        return interaction.editReply({ embeds: [thing] });
        
        }
     };
