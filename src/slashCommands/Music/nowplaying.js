const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')

module.exports = {
    name: "nowplaying",
    description: "Show now playing song",
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
          ephemeral: false
        });
         const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return interaction.editReply({embeds: [thing]});
        }

        const song = player.queue.current

        const emojimusic = client.emoji.music;

        // Progress Bar
        var total = song.duration;
        var current = player.position;
        var size = 20;
        var line = '▬';
        var slider = '🔘';

        let embed = new MessageEmbed()
            .setDescription(`${emojimusic} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration)}]\` [<@${song.requester.id}>]`)
            .setThumbnail(song.displayThumbnail("3"))
            .setColor(client.embedColor)
            .addField("\u200b", progressbar(total, current, size, line, slider))
            .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
         return interaction.editReply({embeds: [embed]})
            
    }
};