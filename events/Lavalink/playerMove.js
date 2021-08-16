module.exports = async (client, player, oldChannel, newChannel) => {

	player.voiceChannel = client.channels.cache.get(newChannel);
	
}