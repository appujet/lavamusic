const {
    MessageButton,
    Message,
    Interaction,
    MessageActionRow
  } = require('discord.js');
  const chalk = require('chalk')
  /**
   * 
   * @param {Message} message  - The message
   * @param {Array} embeds  - Array of embeds
   * @returns Button Pagination
   */
  
  const button_pagination = async (message, embeds) => {
  
    if (!message || !embeds) throw new Error(chalk.red.bold('Please provide all the arguments, and make sure they are valid!'))
  
  
    let index = 0;
  
    let button = new MessageActionRow()
      .addComponents(
        new MessageButton().setCustomId(`-1`).setLabel('⏪').setStyle('SUCCESS'),
        new MessageButton().setCustomId(`-2`).setLabel('⬅️').setStyle('SUCCESS'),
        new MessageButton().setCustomId(`-3`).setLabel('➡️').setStyle('SUCCESS'),
        new MessageButton().setCustomId(`-4`).setLabel('⏩').setStyle('SUCCESS')
      );
  
    let buttons = [
      button
    ]
  
    let msg = await message.channel.send({
      embeds: [embeds[0]],
      components: buttons
    }).then((message) => {
  
      const buttonIDS = [`-1`, `-2`, `-3`, `-4`];
  
      const buttons = async (interaction) => {
        if (!buttonIDS.includes(interaction.customId)) return;
  
        if (interaction.customId == `-1`) {
  
          index = 0;
  
          await interaction.deferUpdate();
  
          await interaction.message.edit({
            embeds: [embeds[index]]
          });
  
        } else if (interaction.customId == `-2`) {
  
          index = index > 0 ? --index : embeds.length - 1;
  
          await interaction.deferUpdate();
  
          await interaction.message.edit({
            embeds: [embeds[index]]
          });
  
        } else if (interaction.customId == `-3`) {
  
  
          index = index + 1 < embeds.length ? ++index : 0;
  
          await interaction.deferUpdate();
  
          await interaction.message.edit({
            embeds: [embeds[index]]
          });
        } else if (interaction.customId == `-4`) {
  
          index = embeds.length - 1;
  
          await interaction.deferUpdate();
  
          await interaction.message.edit({
            embeds: [embeds[index]]
          });
        }
      };
  
      const filter = (interaction) => {
        return !interaction.user.bot
      };
  
      const collector = message.createMessageComponentCollector({
        filter,
        componentType: "BUTTON",
        time: 30000
      });
  
      collector.on("collect", buttons);
      collector.on("end", () => {
        button.components[0].setDisabled(true)
        button.components[1].setDisabled(true)
        button.components[2].setDisabled(true)
        button.components[3].setDisabled(true)
  
  
        message.edit({
          embeds: [embeds[0]],
          components: [button]
        })
      });
    });
  
    return msg;
  
  }
  
  module.exports = { button_pagination }