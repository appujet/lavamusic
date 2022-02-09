const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "filters",
    category: "Music",
    aliases: ["eq", "equalizer"],
    description: "Set Equalizer",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("<:err:935798200869208074> There is no music playing.");
            return message.reply({ embeds: [thing] });
        }
        const emojiequalizer = message.client.emoji.filter;
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`${emojiequalizer} Choose a filter`)

        const but = new MessageButton().setCustomId("clear_but").setLabel("Clear").setStyle("DANGER");
        const but2 = new MessageButton().setCustomId("bass_but").setLabel("Bass").setStyle("PRIMARY");
        const but3 = new MessageButton().setCustomId("night_but").setLabel("Night Core").setStyle("PRIMARY");
        const but4 = new MessageButton().setCustomId("picth_but").setLabel("Pitch").setStyle("PRIMARY");
        const but5 = new MessageButton().setCustomId("distort_but").setLabel("Distort").setStyle("PRIMARY");
        const but6 = new MessageButton().setCustomId("eq_but").setLabel("Equalizer").setStyle("PRIMARY");
        const but7 = new MessageButton().setCustomId("8d_but").setLabel("8D").setStyle("PRIMARY");
        const but8 = new MessageButton().setCustomId("boost_but").setLabel("Bass Boost").setStyle("PRIMARY");
        const but9 = new MessageButton().setCustomId("speed_but").setLabel("Speed").setStyle("PRIMARY");
        const but10 = new MessageButton().setCustomId("vapo_but").setLabel("Vaporwave").setStyle("PRIMARY");

        const row = new MessageActionRow().addComponents(but, but2, but3, but4, but5);
        const row2 = new MessageActionRow().addComponents(but6, but7, but8, but9, but10);

        const m = await message.reply({ embeds: [embed], components: [row, row2] });

        const embed1 = new MessageEmbed().setColor(client.embedColor);
        const collector = m.createMessageComponentCollector({
            filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate().catch(() => { }),
            time: 60000,
            idle: 60000 / 2
        });
        collector.on("end", async () => {
            if (!m) return;
            await m.edit({ embeds: [embed1.setDescription(`<:err:935798200869208074> Time out, type ${prefix}filters again!`)] });
        });
        collector.on("collect", async (b) => {
            if (!b.replied) await b.deferUpdate({ ephemeral: true });
            if (b.customId === "clear_but") {
                await player.clearEffects();
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Equalizer is turned off`)] });
            } else if (b.customId === "bass_but") {
                await player.setBassboost(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Set to bass mode`)] });
            } else if (b.customId === "night_but") {
                await player.setNightcore(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Set to night core mode`)] });
            } else if (b.customId === "picth_but") {
                await player.setPitch(2);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Set to pitch mode`)] });
            } else if (b.customId === "distort_but") {
                await player.setDistortion(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Set to distort mode`)] });
            } else if (b.customId === "eq_but") {
                await player.setEqualizer(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Equalizer turned on`)] });
            } else if (b.customId === "8d_but") {
                await player.set8D(true);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Set to 8D mode`)] });
            } else if (b.customId === "boost_but") {
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                await player.setEQ(...bands);
                if (m) await m.edit({ embeds: [embed], components: [row, row2] });
                return await b.editReply({ embeds: [embed1.setDescription(`${emojiequalizer} Bassboost mode is ON`)] });
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
