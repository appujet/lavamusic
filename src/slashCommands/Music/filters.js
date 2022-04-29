const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "filters",
    description: "Set EqualizerBand",
    permissions: [],
    player: true,
    dj: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "filter",
            description: "Set EqualizerBand",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Clear",
                    value: "clear"
                },
                {
                    name: "Bass",
                    value: "bass",
                },
                {
                    name: "Night Core",
                    value: "night"
                },
                {
                    name: "Picth",
                    value: "picth"
                },
                {
                    name: "Distort",
                    value: "distort"
                },
                {
                    name: "Equalizer",
                    value: "eq"
                },
                {
                    name: "8D",
                    value: "8d"
                },
                {
                    name: "Bassboost",
                    value: "bassboost"
                },
                {
                    name: "Speed",
                    value: "speed"
                },
                {
                    name: "Vaporwave",
                    value: "vapo"
                }
            ]
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const filter = interaction.options.getString("filter");

        const player = interaction.client.manager.get(interaction.guildId);
        if (!player.queue.current) {
            const thing = new MessageEmbed()
                .setDescription('there is nothing playing')
                .setColor(client.embedColor)
            return interaction.editReply({ embeds: [thing] });
        }
        const emojiequalizer = client.emoji.filter;

        let thing = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
        switch (filter) {

            case 'bass':
                player.setBassboost(true);
                thing.setDescription(`${emojiequalizer} Bass mode is ON`);
                break;
            case 'eq':
                player.setEqualizer(true);
                thing.setDescription(`${emojiequalizer} Trablebass mode is ON`);
                break;
            case 'bassboost':
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                player.setEQ(...bands);
                thing.setDescription(`${emojiequalizer} Bassboost mode is ON`);
                break;
            case 'night':
                player.setNightcore(true);
                thing.setDescription(`${emojiequalizer} Night Core Equalizer mode is ON`);
                break;
            case 'pitch':
                player.setPitch(2);
                thing.setDescription(`${emojiequalizer} Pitch Equalizer mode is ON`);
                break;
            case 'distort':
                player.setDistortion(true);
                thing.setDescription(`${emojiequalizer} Distort Equalizer mode is ON`);
                break;
            case 'vapo':
                player.setVaporwave(true);
                thing.setDescription(`${emojiequalizer} Vaporwave Equalizer mode is ON`);
                break;
            case 'clear':
                player.clearEffects();
                thing.setDescription(`${emojiequalizer} Equalizer mode is OFF`);
                break;
            case 'speed':
                player.setSpeed(2);
                thing.setDescription(`${emojiequalizer} Speed mode is OFF`);
            case '8d':
                player.set8D(true);
                thing.setDescription(`${emojiequalizer} 8D mode is OFF`);
        }
        return interaction.editReply({ embeds: [thing] });
    }
};
