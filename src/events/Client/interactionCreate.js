const { CommandInteraction, Client, InteractionType } = require("discord.js")
const db = require("../../schema/prefix.js");
const db2 = require("../../schema/dj");
const db3 = require("../../schema/setup");

module.exports = {
    name: "interactionCreate",
    /**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
    run: async (client, interaction) => {
        let prefix = client.prefix;
        const ress = await db.findOne({ Guild: interaction.guildId })
        if (ress && ress.Prefix) prefix = ress.Prefix;

        if (interaction.type === InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;
            const player = interaction.client.manager.get(interaction.guildId);
            if (SlashCommands.player && !player) {
                if (interaction.replied) {
                    return await interaction.editReply({
                        content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                } else {
                    return await interaction.reply({
                        content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                }
            }
            if (SlashCommands.inVoiceChannel && !interaction.member.voice.channel) {
                if (interaction.replied) {
                    return await interaction.editReply({
                        content: `You must be in a voice channel!`, ephemeral: true
                    }).catch(() => { });
                } else {
                    return await interaction.reply({
                        content: `You must be in a voice channel!`, ephemeral: true
                    }).catch(() => { });
                }
            }
            if (SlashCommands.sameVoiceChannel) {
                if (interaction.guild.me.voice.channel) {
                    if (interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
                        return await interaction.reply({
                            content: `You must be in the same channel as ${interaction.client.user}`, ephemeral: true
                        }).catch(() => { });
                    }
                }
            }
            if (SlashCommands.dj) {
                let data = await db2.findOne({ Guild: interaction.guildId })
                let perm = Permissions.FLAGS.MUTE_MEMBERS;
                if (data) {
                    if (data.Mode) {
                        let pass = false;
                        if (data.Roles.length > 0) {
                            interaction.member.roles.cache.forEach((x) => {
                                let role = data.Roles.find((r) => r === x.id);
                                if (role) pass = true;
                            });
                        };
                        if (!pass && !interaction.member.permissions.has(perm)) return await interaction.reply({ content: `You don't have permission or dj role to use this command`, ephemeral: true })
                    };
                };
            };

            try {
                await SlashCommands.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.reply({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
            
        } 

        if (interaction.isButton()) {
            let data = await db3.findOne({ Guild: interaction.guildId });
            if (data && interaction.channelId === data.Channel && interaction.message.id === data.Message) return client.emit("playerButtons", interaction, data);
        };
    }
};