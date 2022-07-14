const { ChannelType, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../schema/setup");

module.exports = {
    name: "setup",
    category: "config",
    description: "Set custom Music channel",
    args: false,
    usage: "",
    aliases: [],
    userPerms: ["ManageGuild"],
    owner: false,
    execute: async (message, args, client, prefix) => {
        if (
            !message.guild.members.me.permissions.has([
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.Speak,
            ])
        )
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(
                            `I don't have enough permissions to execute this command! Please give me permission \`MANAGE_CHANNELS \` or \`SPEAK\`.`
                        ),
                ],
            });
        try {
            let data = await db.findOne({ Guild: message.guildId });
            if (args.length) {
                if (!data) return await message.reply({ content: `This server doesn't have any song request channel setup to use this sub command.` });
                if (["clear", "delete", "reset"].includes(args[0])) {
                    await data.delete();
                    return await message.reply('Successfully deleted all the setup data.');

                } else return await message.reply('Please provide a valid  command.');
            } else {
                if (data) return await message.reply('Music setup is already finished in this server.');

                const parentChannel = await message.guild.channels.create({
                    name: `${client.user.username} Music Zone`, 
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "SendMessages", "EmbedLinks"]
                        },
                        {
                            type: "role",
                            id: message.guild.roles.cache.everyone.id,
                            allow: ["ViewChannel"]
                        }
                    ]
                });

                const textChannel = await message.guild.channels.create({
                    name: `${client.user.username}-song-requests`,
                    type: ChannelType.GuildText,
                    parent: parentChannel.id,
                    topic: '',
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"]
                        },
                        {
                            type: "role",
                            id: message.guild.roles.cache.find((x) => x.name === "@everyone").id,
                            allow: ["ViewChannnel", "SendMessagss", "ReadMessageHistory"]
                        }
                    ]
                });

                let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
                let rate = rates[0];

                switch (message.guild.premiumTier) {
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

                const voiceChannel = await message.guild.channels.create({
                    name: `${client.user.username} Music`, 
                    type: ChannelType.GuildVoice,
                    parent: parentChannel.id,
                    bitrate: rate,
                    userLimit: 35,
                    permissionOverwrites: [
                        {
                            type: 'member',
                            id: client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "RequestToSpeak"]
                        },
                        {
                            type: 'role',
                            id: message.guild.roles.everyone.id,
                            allow: ["Connect", "ViewChannel"],
                            deny: ["Speak"]
                        }
                    ]
                });


                let disabled = true;
                let player = client.manager.get(message.guildId);
                if (player) disabled = false;

                const title = player && player.queue && player.queue.current ? `Now playing` : "Nothing is playing right now";
                const desc = player && player.queue && player.queue.current ? `[${player.queue.current.title}](${player.queue.current.uri})` : null;
                const footer = {
                    text: player && player.queue && player.queue.current ? `Requested by ${player.queue.current.requester.username}` : "",
                    iconURL: player && player.queue && player.queue.current ? `${player.queue.current.requester.displayAvatarURL({ dynamic: true })}` : `${client.user.displayAvatarURL({ dynamic: true })}`
                };
                const image = client.config.links.img;

                let embed1 = new EmbedBuilder().setColor(client.embedColor).setTitle(title).setFooter({ text: footer.text, iconURL: footer.iconURL }).setImage(image);

                if (player && player.queue && player.queue.current) embed1.setDescription(desc);

                let pausebut = new ButtonBuilder().setCustomId(`pause_but_${message.guildId}`).setEmoji({ name: "⏯️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

                let lowvolumebut = new ButtonBuilder().setCustomId(`lowvolume_but_${message.guildId}`).setEmoji({ name: "🔉" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

                let highvolumebut = new ButtonBuilder().setCustomId(`highvolume_but_${message.guildId}`).setEmoji({ name: "🔊" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

                let previousbut = new ButtonBuilder().setCustomId(`previous_but_${message.guildId}`).setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

                let skipbut = new ButtonBuilder().setCustomId(`skipbut_but_${message.guildId}`).setEmoji({ name: "⏭️" }).setStyle(ButtonStyle.Secondary).setDisabled(disabled);

                const row1 = new ActionRowBuilder().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);

                const msg = await textChannel.send({
                    embeds: [embed1],
                    components: [row1]
                });

                const Ndata = new db({
                    Guild: message.guildId,
                    Channel: textChannel.id,
                    Message: msg.id,
                    voiceChannel: voiceChannel.id,
                });

                await Ndata.save();
                return await message.channel.send({
                    embeds: [new EmbedBuilder().setColor(client.embedColor).setTitle("Setup Finished").setDescription(`**Song request channel has been created.**\n\nChannel: ${textChannel}\n\nNote: Deleting the template embed in there may cause this setup to stop working. (Please don't delete it.)*`).setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })]
                });
            };
        } catch (error) {
            console.error(new Error(error));
        };
    }
}
