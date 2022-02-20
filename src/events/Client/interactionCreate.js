const { CommandInteraction, Client } = require("discord.js")
const pre = require("../../schema/prefix.js");
const i18n = require("../../utils/i18n");

module.exports = {
    name: "interactionCreate",
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

    run: async (client, interaction) => {

        let prefix = client.prefix;
        const ress = await pre.findOne({ Guild: interaction.guildId })
        if (ress && ress.Prefix) prefix = ress.Prefix;
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            const player = interaction.client.manager.get(interaction.guildId);
            if (SlashCommands.player && !player) {
                return await interaction.reply({ content: `${i18n.__("events.inter.noplayer")}`, ephemeral: true });
            }
            if (!interaction.member.permissions.has(SlashCommands.permissions || [])) {
                return await interaction.reply({ content: `${i18n.__("events.inter.noparam")} \`${SlashCommands.permissions.join(", ")}\` ${i18n.__("events.inter.use")}`, ephemeral: true })
            }
            if (SlashCommands.inVoiceChannel && !interaction.member.voice.channel) {
                return await interaction.reply({ content: `${i18n.__("player.vcmust")}`, ephemeral: true });
            }
            if (SlashCommands.sameVoiceChannel){
                if(interaction.guild.me.voice.channel){
                if(interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
                return await interaction.reply({ content: `${i18n.__("player.samevc")} ${interaction.client.user}`, ephemeral: true });
            }
        }
    }

            try {
                await SlashCommands.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.followUp({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
        } else return;
    }
};