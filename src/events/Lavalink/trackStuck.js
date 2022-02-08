const { MessageEmbed } = require("discord.js");

module.exports = async (client, player, track, payload) => {
    
    const channel = client.channels.cache.get(player.textChannel);
    const thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("<:err:935798200869208074> Error when loading song! Track is stuck");
    channel.send({embeds: [thing]});
    client.logger.log(`Error when loading song! Track is stuck in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();

			}