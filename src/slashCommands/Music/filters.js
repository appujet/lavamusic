const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "filters",
    description: "Sets the bot's sound filter.",
    userPrems: [],
    player: true,
    dj: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "filter",
            description: "Select your preferred sound filter.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Clear",
                    value: "clear"
                },
                {
                    name: "Bass",
                    value: "bass"
                },
                {
                    name: "Nightcore",
                    value: "night"
                },
                {
                    name: "Pitch",
                    value: "pitch"
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
                    name: "Bass Boost",
                    value: "bassboost"
                },
                {
                    name: "Speed",
                    value: "speed"
                },
                {
                    name: "Speed (w/o pitch correction)",
                    value: "rate"
                },
                {
                    name: "Vaporwave",
                    value: "vapo"
                }
            ]
        },
        {
            name: "amount",
            description: "Specify the filter's value",
            type: ApplicationCommandOptionType.Number,
            min_value: 0.05,
            max_value: 5.0
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
        let amount = interaction.options.getNumber("amount");
        if(typeof amount === 'undefined' || amount === null) amount = 2; // default value

        const player = interaction.client.manager.get(interaction.guildId);
        if (!player.queue.current) {
            const thing = new EmbedBuilder()
                .setDescription('There is no music playing.')
                .setColor(client.embedColor)
            return interaction.editReply({ embeds: [thing] });
        }
        const emojiequalizer = client.emoji.filter;

        let thing = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
        switch (filter) {

            case 'bass':
                player.setBassboost(true);
                thing.setDescription(`${emojiequalizer} Bass EQ preset has been turned ON`);
                break;
            case 'eq':
                player.setEqualizer(true);
                thing.setDescription(`${emojiequalizer} Equalizer has been turned ON`);
                break;
            case 'bassboost':
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                player.setEQ(...bands);
                thing.setDescription(`${emojiequalizer} Bass Boost (custom EQ) has been turned ON`);
                break;
            case 'night':
                player.setNightcore(true);
                thing.setDescription(`${emojiequalizer} Nightcore EQ preset has been turned ON`);
                break;
            case 'pitch':
                player.setPitch(amount);
                thing.setDescription(`${emojiequalizer} Pitch shift has been SET (${player.getPitch()}×)`);
                break;
            case 'distort':
                player.setDistortion(true);
                thing.setDescription(`${emojiequalizer} Distortion EQ preset has been turned ON`);
                break;
            case 'vapo':
                player.setVaporwave(true);
                thing.setDescription(`${emojiequalizer} Vaporwave EQ preset has been turned ON`);
                break;
            case 'clear':
                player.clearEffects();
                thing.setDescription(`${emojiequalizer} Equalizer has been turned OFF`);
                break;
            case 'speed':
                player.setSpeed(amount);
                thing.setDescription(`${emojiequalizer} Tempo has been SET (${player.getSpeed()}×)`);
                break;
            case 'rate':
                player.setRate(amount);
                thing.setDescription(`${emojiequalizer} Rate has been SET (${player.getRate()}×)`);
                break;
            case '8d':
                player.set8D(true);
                thing.setDescription(`${emojiequalizer} 8D mode has been turned ON`);
        }
        return interaction.editReply({ embeds: [thing] });
    }
};