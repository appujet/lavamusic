import Event from "../../structures/Event.js";
import { buttonReply } from "../../handlers/setup.js";
import { formatTime } from "../../handlers/functions.js";


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
        let iconUrl = this.client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = this.client.user.defaultAvatarURL({ dynamic: true })

        const embed = this.client.embed()
            .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
            .setDescription(`[${title}](${uri}) - ${formatTime(length)}`)
            .setColor(this.client.color.default)
            .setImage(icon)
        
        if (message) {
            switch (interaction.customId) {
                case 'LOW_VOL_BUT':
                    const vol = player.player.filters.volume * 100 - 10;
                    player.player.setVolume(vol);
                    await buttonReply(interaction, `Volume set to ${vol}%`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Volume: ${vol}%`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
            }
        }
    }
}