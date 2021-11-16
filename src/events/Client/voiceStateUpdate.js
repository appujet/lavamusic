const { MusicBot } = require("../../structures/MusicClient");
const { VoiceState, MessageEmbed } = require("discord.js");
/*
 *
 * @param {MusicBot} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (client, oldState, newState) => {
  // get guild and player
  const channel = newState.guild.channels.cache.get(
        newState.channel?.id ?? newState.channelId)
  let guildId = newState.guild.id;
  const player = client.manager.get(guildId);

  // check if the bot is active (playing, paused or empty does not matter (return otherwise)
  if (!player || player.state !== "CONNECTED") return;

  const stateChange = {};
  
  if (oldState.channel === null && newState.channel !== null)
    stateChange.type = "JOIN";
  if (oldState.channel !== null && newState.channel === null)
    stateChange.type = "LEAVE";
  if (oldState.channel !== null && newState.channel !== null)
    stateChange.type = "MOVE";
  if (oldState.channel === null && newState.channel === null) return; // you never know, right
  if (newState.serverMute == true && oldState.serverMute == false)
    return player.pause(true);
  if (newState.serverMute == false && oldState.serverMute == true)
    return player.pause(false);
    
  if (newState.id == client.user.id && channel?.type == 'GUILD_STAGE_VOICE') {
			if (!oldState.channelId) {
				try {
					await newState.guild.me.voice.setSuppressed(false).then(() => console.log(null))
				} catch (err) {
					player.pause(true)
				}
			} else if (oldState.suppress !== newState.suppress) {
				player.pause(newState.suppress)
			}
		}
	if (oldState.id === client.user.id) return
  if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return
  
// Don't leave channel if 24/7 mode is active
	if (player.twentyFourSeven) return
	
  // move check first as it changes type
  if (stateChange.type === "MOVE") {
    if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
    if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
  }
  // double triggered on purpose for MOVE events
  if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
  if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

  // check if the bot's voice channel is involved (return otherwise)
  if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
    return;

  // filter current users based on being a bot
  stateChange.members = stateChange.channel.members.filter(
    (member) => !member.user.bot
  );

  switch (stateChange.type) {
    case "JOIN":
      if (stateChange.members.size === 1 && player.paused) {
        let emb = new MessageEmbed()
          .setAuthor(`Resuming paused queue`)
          .setColor(client.embedColor)
          .setDescription(
            `Resuming playback because all of you left me with music to play all alone`
          );
        await client.channels.cache.get(player.textChannel).send({embeds: [emb]});

        let msg2 = await client.channels.cache
          .get(player.textChannel)
          .send({embeds: [player.nowPlayingMessage.embeds[0]]});
        player.setNowplayingMessage(msg2);

        player.pause(false);
      }
      break;
    case "LEAVE":
      if (stateChange.members.size === 0 && !player.paused && player.playing) {
        player.pause(true);

        let emb = new MessageEmbed()
          .setAuthor(`Paused!`)
          .setColor(client.embedColor)
          .setDescription(`The player has been paused because everybody left`);
        await client.channels.cache.get(player.textChannel).send({embeds: [emb]});
      }
      break;
  }
};
