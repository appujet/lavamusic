const { Client, Message, Permissions } = require("discord.js")
const { playerhandler, oops } = require("../../utils/functions");

module.exports = {
    name: "setupSystem",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */

    run: async (client, message) => {

        if(!message.member.voice.channel) {
            await oops(message.channel, `You are not connected to a voice channel to queue songs.`, client.embedColor);
            if(message) await message.delete().catch(() => {});
            return;
        };

        if(!message.member.voice.channel.permissionsFor(client.user).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) {
            await oops(message.channel,`I don't have enough permission to connect/speak in ${message.member.voice.channel}`);
            if(message) await message.delete().catch(() => {});
            return;
        };

        if(message.guild.me.voice.channel && message.guild.me.voice.channelId !== message.member.voice.channelId) {
            await oops(message.channel, `You are not connected to <#${message.guild.me.voice.channelId}> to queue songs`);
            if(message) await message.delete().catch(() => {});
            return;
        };

        let player = client.manager.get(message.guildId);
        
        if(!player) player = client.manager.create({
            guild: message.guildId,
            textChannel: message.channelId,
            voiceChannel: message.member.voice.channelId,
            selfDeafen: true,
            volume: 100
        });

        await playerhandler(message.content, player, message);
        if(message) await message.delete().catch(() => {});
    }
}