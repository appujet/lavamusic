const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "lyrics",
  description: "Prints the lyrics of a song",
  permissions: [],
  player: true,
  dj: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "song",
      description: "The song to get lyrics for.",
      type: "3",
      required: true,
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
        new MessageEmbed()
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
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });
    }

    const args = interaction.options.getString("song");
    if (!args && !player) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("There's nothing playing"),
        ],
      });
    }

    let search = args ? args : player.queue.current.title;
    // Lavalink api for lyrics
    let url = `https://api.darrennathanael.com/lyrics?song=${search}`;

    let lyrics = await fetch(url)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        return err.name;
      });
    if (!lyrics || lyrics.response !== 200 || lyrics === "FetchError") {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `❌ | No lyrics found for ${search}!\nMake sure you typed in your search correctly.`
            ),
        ],
      });
    }

    let text = lyrics.lyrics;
    let lyricsEmbed = new MessageEmbed()
      .setColor(client.embedColor)
      .setTitle(`${lyrics.full_title}`)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setDescription(text);

    if (text.length > 4096) {
      text = text.substring(0, 4090) + "[...]";
      lyricsEmbed
        .setDescription(text)
        .setFooter({ text: "Truncated, the lyrics were too long." });
    }

    return interaction.editReply({ embeds: [lyricsEmbed] });
  },
};
