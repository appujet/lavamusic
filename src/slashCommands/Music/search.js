const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, Client, CommandInteraction, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const { convertTime } = require("../../utils/convert");

module.exports = {
    name: "search",
    description: "Search for a song on YouTube.",
    userPrems: [],
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "input",
            description: "Song to search for.",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction,) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const query = interaction.options.getString("input");
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(['Speak', 'Connect']))) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions to execute this command! Please give me permission to \`CONNECT\` or \`SPEAK\`.`)] });
        const { channel } = interaction.member.voice;
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.resolve(['Speak', 'Connect']))) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions to connect to your VC. Please give me permission to \`CONNECT\` or \`SPEAK\`.`)] });
        const msg = await interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Searching ${query} song please wait`)] });

        let player = interaction.client.manager.get(interaction.guildId);
        if (!player)
            player = interaction.client.manager.create({
                guild: interaction.guildId,
                voiceChannel: channel.id,
                textChannel: interaction.channelId,
                volume: 80,
                selfDeafen: true,
            })
        if (player && player.state !== "CONNECTED") player.connect();

        const but = new ButtonBuilder().setCustomId("s_one").setLabel("1").setStyle(ButtonStyle.Success);
        const but2 = new ButtonBuilder().setCustomId("s_two").setLabel("2").setStyle(ButtonStyle.Success);
        const but3 = new ButtonBuilder().setCustomId("s_three").setLabel("3").setStyle(ButtonStyle.Success);
        const but4 = new ButtonBuilder().setCustomId("s_four").setLabel("4").setStyle(ButtonStyle.Success);
        const but5 = new ButtonBuilder().setCustomId("s_five").setLabel("5").setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(but, but2, but3, but4, but5);

        const emojiplaylist = client.emoji.playlist;

        let s = await player.search(query, interaction.user);
        switch (s.loadType) {
            case "NO_MATCHES":
                const nomatch = new EmbedBuilder()
                    .setDescription(`No search results found for ${query}`)
                    .setColor("Red")
                msg.edit({ embeds: [nomatch] });
                if (!player.playing){
                    player.destroy()
                }
                break;
            case "TRACK_LOADED":
                player.queue.add(s.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[0].title}](${s.tracks[0].uri}) \`${convertTime(s.tracks[0].duration, true)}\` • ${s.tracks[0].requester}`)
                    .setColor(client.embedColor)

                msg.edit({ embeds: [embed] });
                if (!player.playing) player.play()
                break;
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = s.tracks.slice(0, 5);
                const results = s.tracks.slice(0, 5).map(x => `• ${index++} | [${x.title}](${x.uri}) \`${convertTime(x.duration)}\``)
                    .join("\n");
                const searched = new EmbedBuilder()
                    .setTitle("Select the track that you want.")
                    .setColor(client.embedColor)
                    .setDescription(results);

                await msg.edit({ embeds: [searched], components: [row] });
                const search = new EmbedBuilder()
                    .setColor(client.embedColor);

                const collector = msg.createMessageComponentCollector({
                    filter: (f) => f.user.id === interaction.user.id ? true : false && f.deferUpdate(),
                    max: 1,
                    time: 60000,
                    idle: 60000 / 2
                });

                collector.on("end", async (collected) => {
                    if(msg) await msg.edit({components: [new ActionRowBuilder().addComponents(but.setDisabled(true), but2.setDisabled(true), but3.setDisabled(true), but4.setDisabled(true), but5.setDisabled(true))] })
                });

                collector.on("collect", async (b) => {
                    if (!b.deferred) await b.deferUpdate();
                    if (!player && !collector.ended) return collector.stop();
                    if (player.state !== "CONNECTED") player.connect();

                    if (b.customId === "s_one") {
                        player.queue.add(s.tracks[0]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                        if(msg) await msg.edit({ embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[0].title}](${s.tracks[0].uri}) \`${convertTime(s.tracks[0].duration, true)}\` • ${interaction.member.user}`)] })
                    } else if (b.customId === "s_two") {
                        player.queue.add(s.tracks[1]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                        if(msg) await msg.edit({ embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[1].title}](${s.tracks[1].uri}) \`${convertTime(s.tracks[1].duration, true)}\` • ${interaction.member.user}`)] })

                    } else if (b.customId === "s_three") {
                        player.queue.add(s.tracks[2]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                        if(msg)  await msg.edit({ embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[2].title}](${s.tracks[2].uri}) \`${convertTime(s.tracks[2].duration, true)}\` • ${interaction.member.user}`)] })

                    } else if (b.customId === "s_four") {
                        player.queue.add(s.tracks[3]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                        if(msg)  await msg.edit({ embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[3].title}](${s.tracks[3].uri}) \`${convertTime(s.tracks[3].duration, true)}\` • ${interaction.member.user}`)] })

                    } else if (b.customId === "s_five") {
                        player.queue.add(s.tracks[4]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                        if(msg)  await msg.edit({ embeds: [search.setDescription(`${emojiplaylist} **Added to queue** - [${s.tracks[4].title}](${s.tracks[4].uri}) \`${convertTime(s.tracks[4].duration, true)}\` • ${s.tracks[4].requester}`)] })

                    }
                    
                });
                break;
            case "PLAYLIST_LOADED":
                player.queue.add(s.tracks)
                    const list = new EmbedBuilder()
                        .setDescription(`Playlist Loaded [${s.playlist.name}](${query})`)
                        .setColor(client.embedColor)
                        msg.edit({embeds: [list] });
                        if(!player.playing) player.play()


        }

    }
}



