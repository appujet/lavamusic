const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { get } = require("node-superfetch");

module.exports = {
  name: "lyrics",
  description: "Gets the lyrics of a song.",
  userPrems: [],
  player: true,
  dj: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "song",
      description: "Song name to return lyrics for.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription("🔎 **Searching...**"),
      ],
    });

    let player;
    if (client.manager) {
      player = client.manager.players.get(interaction.guild.id);
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("Lavalink node is not connected."),
        ],
      });
    }

    const args = interaction.options.getString("song");
    if (!args && !player) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("There's no music playing."),
        ],
      });
    }

    let search = args ? args : player.queue.current.title;
    // Lavalink api for lyrics
    let url = `https://api.darrennathanael.com/lyrics?song=${search}`;

    let lyrics = await get(url);

    if (!lyrics || lyrics.status !== 200) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ | No lyrics found for ${search}!\nMake sure you entered your search correctly.`
            ),
        ],
      });
    }

    let text = lyrics.body.lyrics;
    let lyricsEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(`${lyrics.body.full_title}`)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.body.thumbnail)
      .setDescription(text);

    if (text.length > 4096) {
      text = text.substring(0, 4090) + "[...]";
      lyricsEmbed
        .setDescription(text)
        .setFooter({ text: "Truncated, the lyrics were too long." });
    }

    return await interaction.editReply({ embeds: [lyricsEmbed] });
  },
};
