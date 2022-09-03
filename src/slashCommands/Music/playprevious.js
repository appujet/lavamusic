const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "previous",
  description: "Go Back to Previous song/track from the queue.",
  userPrems: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: true
    });

    const player = interaction.client.manager.get(interaction.guildId);

    if (!player)
        return await interaction.editReply({
            content: "There is no Player for this Guild",
            ephemeral: true
        }).catch(() => {});
    
	const pre = player.queue.previous;
	const curr = player.queue.current;
	const next = player.queue[0];
    const emojimusic = client.emoji.music

	if (!pre
		|| pre === curr
		|| pre === next) 
		return await interaction.editReply({
            content: "There is no previous song in the queue.",
            ephemeral: true
    }).catch(() => {});


	    if (pre !== curr && pre !== next) {
		player.queue.splice(0, 0, curr)
		player.play(pre);
	    }
	await interaction.editReply({
        content: ` ${emojimusic} Playing Previous song: **${pre.title}**`,
        ephemeral: false
    }).catch(() => {})
}}