import Event from "../../structures/Event.js";
import { oops } from "../../handlers/functions.js";
import { PermissionsBitField } from "discord.js";
import { setupStart } from "../../handlers/setup.js";


export default class SetupSystem extends Event {
    constructor(...args) {
        super(...args);
    }
    /**
     * 
     * @param {import("discord.js").Message} message
     */
    async run(message) {
        if (!message.member.voice.channel) {
            await oops(message.channel, `You are not connected to a voice channel to queue songs.`, this.client.config.color.warn);
            if (message) await message.delete().catch(() => { });
            return;
        };

        if (!message.member.voice.channel.permissionsFor(this.client.user).has(PermissionsBitField.resolve(['Connect', 'Speak']))) {
            await oops(message.channel, `I don't have enough permission to connect/speak in ${message.member.voice.channel}`);
            if (message) await message.delete().catch(() => { });
            return;
        };

        if (message.guild.members.cache.get(this.client.user.id).voice.channel && message.guild.members.cache.get(this.client.user.id).voice.channelId !== message.member.voice.channelId) {
            await oops(message.channel, `You are not connected to <#${message.guild.members.cache.get(this.client.user.id).voice.channelId}> to queue songs`);
            if (message) await message.delete().catch(() => { });
            return;
        };
        let player = this.client.manager.getPlayer(message.guild.id);
        if (!player) {
            player = await this.client.manager.create(message.guild, message.member, message.channel)
        }
        await setupStart(this.client, message.content, player, message) 
        if (message) await message.delete().catch(() => { });
    }
}