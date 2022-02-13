const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
const i18n = require("../../utils/i18n");

module.exports = {
    name: i18n.__("cmd.filter.name"),
    description: i18n.__("cmd.filter.des"),
    options: [
        {
            name: i18n.__("cmd.filter.slash.name"),
            description: i18n.__("cmd.filter.slash.name"),
            type: "STRING",
            required: true,
            choices: [
                {
                    name: i18n.__("cmd.filter.but1"),
                    value: "clear"
                },
                {
                    name: i18n.__("cmd.filter.but2"),
                    value: "bass",
                },
                {
                    name: i18n.__("cmd.filter.but3"),
                    value: "night"
                },
                {
                    name: i18n.__("cmd.filter.but4"),
                    value: "picth"
                },
                {
                    name: i18n.__("cmd.filter.but5"),
                    value: "distort"
                },
                {
                    name: i18n.__("cmd.filter.but6"),
                    value: "eq"
                },
                {
                    name: i18n.__("cmd.filter.but7"),
                    value: "8d"
                },
                {
                    name: i18n.__("cmd.filter.but8"),
                    value: "bassboost"
                },
                {
                    name: i18n.__("cmd.filter.but9"),
                    value: "speed"
                },
                {
                    name: i18n.__("cmd.filter.but10"),
                    value: "vapo"
                }
            ]
        }
    ],

    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({});
        const filter = interaction.options.getString("filter");

        const player = interaction.client.manager.get(interaction.guildId);
        if (!player.queue.current) {
            const thing = new MessageEmbed()
            .setDescription(i18n.__("player.nomusic"))
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
                thing.setDescription(`${emojiequalizer}${i18n.__("cmd.filter.em2")}`);
                break;
            case 'eq':
                player.setEqualizer(true);
                thing.setDescription(`${emojiequalizer} ${i18n.__("cmd.filter.em6")}`);
                break;
            case 'bassboost':
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                player.setEQ(...bands);
                thing.setDescription(`${emojiequalizer} ${i18n.__("cmd.filter.em8")}`);
                break;
            case 'night':
                player.setNightcore(true);
                thing.setDescription(`${emojiequalizer} ${i18n.__("cmd.filter.em3")}`);
                break;
            case 'pitch':
                player.setPitch(2);
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em4")}`);
                break;
            case 'distort':
                player.setDistortion(true);
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em5")}`);
                break;
            case 'vapo':
                player.setVaporwave(true);
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em10")}`);
                break;
            case 'clear':
                player.clearEffects();
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em1")}`);
                break;
            case 'speed':
                player.setSpeed(2);
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em9")}`);
            case '8d':
                player.set8D(true);
                thing.setDescription(`${emojiequalizer}  ${i18n.__("cmd.filter.em7")}`);
        }
        return interaction.editReply({ embeds: [thing] });
    }
};
