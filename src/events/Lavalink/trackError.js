const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    const thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ Error when loading song! Track is error");
    channel.send({embeds: [thing]}).then(msg => { setTimeout(() => { msg.delete() }, 5000) });
    client.logger.log(`Error when loading song! Track is error in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();

}
