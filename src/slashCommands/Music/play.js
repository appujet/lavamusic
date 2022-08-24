const { CommandInteraction, Client, EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
module.exports = {
  name: "play",
  description: "Plays audio from any supported source.",
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "input",
      description: "Song name or URL to play.",
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
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(['Speak', 'Connect']))) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions to execute this command! Please give me permission to \`CONNECT\` or \`SPEAK\`.`)] });
    const { channel } = interaction.member.voice;
    if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.resolve(['Speak', 'Connect']))) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions connect your VC! Please give me permission to \`CONNECT\` or \`SPEAK\`.`)] });

    const emojiaddsong = client.emoji.addsong;
    const emojiplaylist = client.emoji.playlist;
    let search = interaction.options.getString("input");
    let res;

    let player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member.voice.channelId,
      selfDeafen: true,
      volume: 100
    });

    if (player.state != "CONNECTED") await player.connect();

    try {
      res = await player.search(search, interaction.member.user);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setTimestamp().setDescription(`❌ | **There was an error while searching.**`)] });
      }
    } catch (err) {
      console.log(err)
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setTimestamp().setDescription("❌ | **No results were found.**")] });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new EmbedBuilder()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(`${emojiplaylist} **Added song to queue** [${res.tracks[0].title}](${res.tracks[0].uri}) - \`[${convertTime(res.tracks[0].duration)}]\``);
        return await interaction.editReply({ embeds: [trackload] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        
        const playlistloadds = new EmbedBuilder()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(`${emojiplaylist} **Playlist added to queue** [${res.playlist.name}](${search}) - \`[${convertTime(res.playlist.duration)}]\``);

if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)await player.play();
       
        return await interaction.editReply({ embeds: [playlistloadds] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length) {
          const searchresult = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(`${emojiplaylist} **Added song to queue** [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]`);

          player.play();
          return await interaction.editReply({ embeds: [searchresult] });

        } else {
          const thing = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(`${emojiplaylist} **Added song to queue** [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\``);

          return await interaction.editReply({ embeds: [thing] });

        }
    }
  }
}

