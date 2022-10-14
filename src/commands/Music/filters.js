const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "filters",
    category: "Music",
    aliases: ["eq", "equalizer"],
    description: "Sets the bot's sound filter.",
    args: false,
    usage: "",
    userPerms: [],
    dj: true,
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription("There is no music playing.");
            return message.reply({ embeds: [thing] });
        }
        const emojiequalizer = message.client.emoji.filter;
        const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`Select your preferred sound filter below.`)

        const but = new ButtonBuilder().setCustomId("clear_but").setLabel("Clear").setStyle(ButtonStyle.Danger);
        const but2 = new ButtonBuilder().setCustomId("bass_but").setLabel("Bass").setStyle(ButtonStyle.Primary);
        const but3 = new ButtonBuilder().setCustomId("night_but").setLabel("Nightcore").setStyle(ButtonStyle.Primary);
        const but4 = new ButtonBuilder().setCustomId("pitch_but").setLabel("Pitch").setStyle(ButtonStyle.Primary);
        const but5 = new ButtonBuilder().setCustomId("distort_but").setLabel("Distort").setStyle(ButtonStyle.Primary);
        const but6 = new ButtonBuilder().setCustomId("eq_but").setLabel("Equalizer").setStyle(ButtonStyle.Primary);
        const but7 = new ButtonBuilder().setCustomId("8d_but").setLabel("8D").setStyle(ButtonStyle.Primary);
        const but8 = new ButtonBuilder().setCustomId("boost_but").setLabel("Bass Boost").setStyle(ButtonStyle.Primary);
        const but9 = new ButtonBuilder().setCustomId("speed_but").setLabel("Speed").setStyle(ButtonStyle.Primary);
        const but10 = new ButtonBuilder().setCustomId("vapo_but").setLabel("Vaporwave").setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(but, but2, but3, but4, but5);
        const row2 = new ActionRowBuilder().addComponents(but6, but7, but8, but9, but10);

        const m = await message.reply({ embeds: [embed], components: [row, row2] });

        const embed1 = new EmbedBuilder().setColor(client.embedColor);
        const collector = m.createMessageComponentCollector({
            filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate().catch(() => { }),
            time: 60000,
            idle: 60000 / 2
        });
        collector.on("end", async () => {
            if (!m) return;
            await m.edit({ embeds: [embed1.setDescription(`Command timed out! Run ${prefix}filters again.`)] });
        });
        collector.on("collect", async (b) => {
            if (!b.replied) await b.deferUpdate({ ephemeral: true });
            if (b.customId === "clear_but") {
                await player.clearEffects();
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Equalizer mode is OFF`)] });
            } else if (b.customId === "bass_but") {
                await player.setBassboost(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Bass mode is ON`)] });
            } else if (b.customId === "night_but") {
                await player.setNightcore(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Nightcore mode is ON`)] });
            } else if (b.customId === "pitch_but") {
                await player.setPitch(2);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Pitch mode is ON`)] });
            } else if (b.customId === "distort_but") {
                await player.setDistortion(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Distort mode is ON`)] });
            } else if (b.customId === "eq_but") {
                await player.setEqualizer(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Equalizer mode is ON`)] });
            } else if (b.customId === "8d_but") {
                await player.set8D(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} 8D mode is ON`)] });
            } else if (b.customId === "boost_but") {
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                await player.setEQ(...bands);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Bass Boost mode is ON`)] });
            } else if (b.customId === "speed_but") {
                await player.setSpeed(2);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Speed mode is ON`)] });
            } else if (b.customId === "vapo_but") {
                await player.setVaporwave(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Vaporwave mode is ON`)] });
            }
        });
    }
};
