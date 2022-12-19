import Event from "../../structures/Event.js";
import { buttonReply } from "../../handlers/setup.js";

export default class SetupButtons extends Event {
    constructor(...args) {
        super(...args);
    }
    /**
     * 
     * @param {import('discord.js').Interaction} interaction
     * @param {Object} data
     *    
     */
    async run(interaction, data) {
        if (!interaction.replied) await interaction.deferReply().catch(() => { });
        if (!interaction.member.voice.channel) return await buttonReply(interaction, `You are not connected to a voice channel to use this button.`, this.client.color.error);
        if (interaction.guild.members.cache.get(this.client.user.id).voice.channel && interaction.guild.members.cache.get(this.client.user.id).voice.channelId !== interaction.member.voice.channelId) return await buttonReply(interaction, `You are not connected to ${interaction.guild.me.voice.channel} to use this buttons.`, this.client.color.error);
        const player = this.client.manager.getPlayer(interaction.guildId);
        if (!player) return await buttonReply(interaction, `There is no music playing in this server.`, this.client.color.error);
        if (!player.queue) return await buttonReply(interaction, `There is no music playing in this server.`, this.client.color.error);
        if (!player.current) return await buttonReply(interaction, `There is no music playing in this server.`, this.client.color.error);

        const { title, uri, author, length } = player.current.info;
        let message;
        try {

            message = await interaction.channel.messages.fetch(data.Message, { cache: true });

        } catch (e) { };
        const icon = player ? player.displayThumbnail(player.current) : this.client.config.links.img;

        const embed = this.client.embed()
        
    }
}