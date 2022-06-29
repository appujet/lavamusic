const { CommandInteraction, Client, interactionEmbed, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const db = require("../../schema/setup");

module.exports = {
    name: "setupmusic",
    description: "Set Song request channel",
    options: [
        {
            name: "set",
            description: "To setup the song request channel setup.",
            type: "SUB_COMMAND"

        },
        {
            name: "delete",
            description: "To delete the song request channel setup.",
            type: "SUB_COMMAND"
        }
    ],


    run: async (client, interaction, prefix) => {

            let data = await db.findOne({ Guild: interaction.guildId });
            if (interaction.options.getSubcommand() === "set") {
                if (data) return await interaction.reply({ content: `Music setup is already finished in this server.` });
                const parent = await interaction.guild.channels.create(`${client.user.username} Music Zone`, {
                    type: "GUILD_CATEGORY",
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["CONNECT", "SPEAK", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                            allow: ["VIEW_CHANNEL"]
                        }
                    ]
                });
    
                const textChannel = await interaction.guild.channels.create(`${client.user.username}-song-requests`, {
                    type: "GUILD_TEXT", 
                    parent: parent.id , 
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"]
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        }
                    ]
                });
    
                let rates = [1000*64, 1000*96, 1000*128, 1000*256, 1000*384];
                let rate = rates[0];
    
                switch(interaction.guild.premiumTier) {
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
    
                const voiceChannel = await interaction.guild.channels.create(`${client.user.username} Music`, {
                    type: "GUILD_VOICE",
                    parent: parent.id,
                    bitrate: rate,
                    userLimit: 35,
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: ["CONNECT", "SPEAK", "VIEW_CHANNEL", "REQUEST_TO_SPEAK"]
                        },
                        {
                            type: "role",
                            id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                            allow: ["CONNECT", "VIEW_CHANNEL"],
                            deny: ["SPEAK"]
                        }
                    ]
                });

                let disabled = true;
                let player = client.manager.get(interaction.guildId);
                if (player) disabled = false;
                
                const title = player && player.queue && player.queue.current ? `Now playing` : "Nothing is playing right now";
                const desc = player && player.queue && player.queue.current ? `[${player.queue.current.title}](${player.queue.current.uri})` : null;
                const footer = {
                    text: player && player.queue && player.queue.current ? `Requested by ${player.queue.current.requester.username}` : "",
                    iconURL: player && player.queue && player.queue.current ? `${player.queue.current.requester.displayAvatarURL({ dynamic: true })}` : `${client.user.displayAvatarURL({ dynamic: true })}`
                };
                // let image = player.queue.current?.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.links.img;
                let image = client.config.links.img;

                let embed1 = new  MessageEmbed().setColor(client.embedColor).setTitle(title).setFooter({ text: footer.text, iconURL: footer.iconURL }).setImage(image);

                if (player && player.queue && player.queue.current) embed1.setDescription(desc);

                let pausebut = new MessageButton().setCustomId(`pause_but_${interaction.guildId}`).setEmoji("⏯️").setStyle("SECONDARY").setDisabled(disabled);

                let lowvolumebut = new MessageButton().setCustomId(`lowvolume_but_${interaction.guildId}`).setEmoji("🔉").setStyle("SECONDARY").setDisabled(disabled);

                let highvolumebut = new MessageButton().setCustomId(`highvolume_but_${interaction.guildId}`).setEmoji("🔊").setStyle("SECONDARY").setDisabled(disabled);

                let previousbut = new MessageButton().setCustomId(`previous_but_${interaction.guildId}`).setEmoji("⏮️").setStyle("SECONDARY").setDisabled(disabled);

                let skipbut = new MessageButton().setCustomId(`skipbut_but_${interaction.guildId}`).setEmoji("⏭️").setStyle("SECONDARY").setDisabled(disabled);

                const row1 = new MessageActionRow().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);

               
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
                return await interaction.reply({
                    embeds: [new MessageEmbed().setColor(client.embedColor).setTitle("Setup Finished").setDescription(`**Song request channel has been created.**\n\nChannel: ${textChannel}\n\nNote: Deleting the template embed in there may cause this setup to stop working. (Please don't delete it.)*`).setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })]
                });
            } else if (interaction.options.getSubcommand() === "delete") {
                if (!data) return await interaction.reply({ content: `This server doesn't have any song request channel setup to use this sub command.` });
                await data.delete();
                return await interaction.reply({ content: `Successfully deleted all the setup data.` });
            }
    }
};
