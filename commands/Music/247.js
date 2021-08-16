module.exports = {
    name: "247",
    aliases: ["24h", "24/7", "24*7"],
    category: "Music",
    description: "24/7 in voice channel",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
	execute(message, args) {
	  
  const player = message.client.manager.players.get(message.guild.id);
		if (!player) return message.channel.send({
		  embed: {
		    color: "RED",
		    description:' there is nothing playing'}}).then(m => m.delete({ timeout: 5000 }));
     
  const { channel } = message.member.voice

		if (player.twentyFourSeven) {
			player.twentyFourSeven = false;
			return message.channel.send({
			  embed: {
			    color: "GREEN",
			    description:' 24/7 mode is **disabled**'}});
		} else {
			player.twentyFourSeven = true;
			return message.channel.send({
			  embed: {
			    color: "GREEN",
			    description:' 24/7 mode is **enabled**'}});
		}

  }
}
