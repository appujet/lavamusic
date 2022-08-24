const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, ChannelType, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const db = require("../../schema/setup");

module.exports = {
    name: "setupmusic",
    description: "Sets the music command channel.",
    default_userPerms: ['Administrator'],
    default_member_permissions: ['ManageGuild'],
    options: [
        {
            name: "set",
            description: "Setup the song request channel.",
            type: ApplicationCommandOptionType.Subcommand

        },
        {
            name: "delete",
            description: "Delete the song request channel.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],


    run: async (client, interaction, prefix) => {
        await interaction.deferReply();
        let data = await db.findOne({ Guild: interaction.guildId });
        if (interaction.options.getSubcommand() === "set") {
            if (data) return await interaction.reply(`Setup has already been completed in this server.`);
            const parent = await interaction.guild.channels.create({
                name: `${client.user.username} Music Zone`, 
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.everyone.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });

            const textChannel = await interaction.guild.channels.create({
                name: `${client.user.username}-song-requests`, 
                type: ChannelType.GuildText,
                parent: parent.id,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.everyone.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    }
                ]
            });

            let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
            let rate = rates[0];

            switch (interaction.guild.premiumTier) {
                case "NONE":
                    rate = rates[1];
                    break;

                case "TIER_1":
                    rate = rates[2];
                    break;

                case "TIER_2":
                    rate = rates[3];
                    break;

                case "TIER_3":
                    rate = rates[4];
                    break;
            };

            const voiceChannel = await interaction.guild.channels.create({
                name: `${client.user.username} Music`, 
                type: ChannelType.GuildVoice,
                parent: parent.id,
                bitrate: rate,
                userLimit: 35,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.RequestToSpeak]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.everyone.id,
                        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel],
                        deny: [PermissionFlagsBits.Speak]
                    }
                ]
            });

            let disabled = true;
            let player = client.manager.get(interaction.guildId);
            if (player) disabled = false;

            const title = player && player.queue && player.queue.current ? `Now playing` : "Nothing is playing right now";
            const desc = player && player.queue && player.queue.current ? `[${player.queue.current.title}](${player.queue.current.uri})` : null;
            const footer = {
                text: player && player.queue && player.queue.current ? `Requested by ${player.queue.current.requester.username}` : "null",
                iconURL: player && player.queue && player.queue.current ? `${player.queue.current.requester.displayAvatarURL()}` : `${client.user.displayAvatarURL()}`
            };
            // let image = player.queue.current?.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.links.img;
            let image = client.config.links.img;

            let embed1 = new EmbedBuilder().setColor(client.embedColor).setTitle(title).setFooter({ text: footer.text, iconURL: footer.iconURL }).setImage(image);

            if (player && player.queue && player.queue.current) embed1.setDescription(desc);

            let pausebut = new ButtonBuilder().setCustomId(`pause_but_${interaction.guildId}`).setEmoji({ name: "⏯️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

            let lowvolumebut = new ButtonBuilder().setCustomId(`lowvolume_but_${interaction.guildId}`).setEmoji({ name: "🔉" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

            let highvolumebut = new ButtonBuilder().setCustomId(`highvolume_but_${interaction.guildId}`).setEmoji({ name: "🔊" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

            let previousbut = new ButtonBuilder().setCustomId(`previous_but_${interaction.guildId}`).setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

            let skipbut = new ButtonBuilder().setCustomId(`skipbut_but_${interaction.guildId}`).setEmoji({ name: "⏭️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

            const row1 = new ActionRowBuilder().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);


            const msg = await textChannel.send({
                embeds: [embed1],
                components: [row1]
            });

            const Ndata = new db({
                Guild: interaction.guildId,
                Channel: textChannel.id,
                Message: msg.id,
                voiceChannel: voiceChannel.id,
            });

            await Ndata.save();
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor(client.embedColor).setTitle("Setup Finished").setDescription(`**Song request channel has been created.**\n\nChannel: ${textChannel}\n\nNote: Deleting the template embed in there may cause this setup to stop working. (Please don't delete it.)*`).setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })]
            });
        } else if (interaction.options.getSubcommand() === "delete") {
            if (!data) return await interaction.reply(`This server doesn't have a song request channel setup to use this sub command.`);
            await data.delete();
            return await interaction.editReply(`Successfully deleted all the setup data.`);
        }
    }
};
