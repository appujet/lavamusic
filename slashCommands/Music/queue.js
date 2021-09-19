const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
  name: "queue",
  description: "Show the music queue and now playing.",
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  options: [
    {
      name: "page",
      description: "Show the music queue page",
      required: false,
      type: "NUMBER"
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
    const args = interaction.options.getNumber("page");

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      const thing = new MessageEmbed()
        .setDescription('there is nothing playing')
        .setColor(client.embedColor)
      return interaction.editReply({ embeds: [thing] });
     }
      const { queue } = player;

      const emojiQueue = client.emoji.queue;

      const multiple = 10;
	  let maxPages = Math.ceil(queue.length / multiple);
	  if(maxPages <= 0) maxPages = 1;
      let page = args ? args : 1;
	  if(page <= 0) page = 1;
	  else if(page > maxPages) page = 1;

      const embed = new MessageEmbed()
        .setColor(client.embedColor)

      const end = page * multiple;
      const start = end - multiple;

      const tracks = queue.slice(start, end);

      if (queue.current) embed.addField("Now Playing", `[${queue.current.title}](${queue.current.uri}) \`[${convertTime(queue.current.duration)}]\``);

      if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
      else embed.setDescription(`${emojiQueue} Queue List\n` + tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) \`[${convertTime(track.duration)}]\``).join("\n"));

      embed.addField("\u200b", `Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

      return interaction.editReply({ embeds: [embed] });

    }

  };
