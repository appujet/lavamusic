const { MessageEmbed } = require("discord.js");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    const thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("<:err:935798200869208074> Error when loading song! Track error");
    channel.send({embeds: [thing]});
    client.logger.log(`Error when loading song! Track error in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();

}