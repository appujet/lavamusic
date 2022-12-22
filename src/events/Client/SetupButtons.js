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

        const { title, uri, length } = player.current.info;
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
            .setImage(icon);
        
        if (message) {
            switch (interaction.customId) {
                case 'LOW_VOL_BUT':
                    const vol = player.volume * 100 - 10;
                    player.player.setVolume(vol / 100);
                    await buttonReply(interaction, `Volume set to ${vol}%`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Volume: ${vol}%`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'HIGH_VOL_BUT':
                    const vol2 = player.volume * 100 + 10;
                    player.player.setVolume(vol2 / 100);
                    await buttonReply(interaction, `Volume set to ${vol2}%`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Volume: ${vol2}%`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'PAUSE_BUT':
                    const name = player.player.paused ? `Resumed` : `Paused`;
                    player.pause(player.player.paused ? false : true)
                    await buttonReply(interaction, `${name} the music.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `${name} by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'SKIP_BUT':
                    if(player.queue.length === 0) return await buttonReply(interaction, `There is no music to skip.`, this.client.color.default );
                    player.skip();
                    await buttonReply(interaction, `Skipped the music.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Skipped by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'STOP_BUT':
                    player.stop();
                    await buttonReply(interaction, `Stopped the music.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Stopped by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'LOOP_BUT':
                    const random = ["off", "queue", "repeat"];
                    const loop = random[Math.floor(Math.random() * random.length)];
                    if (player.loop === loop) return await buttonReply(interaction, `Loop is already ${player.loop}.`, this.client.color.default);
                    player.setLoop(loop);
                    await buttonReply(interaction, `Loop set to ${player.loop}.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Loop set to ${player.loop} by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'SHUFFLE_BUT':
                    player.setShuffle(player.shuffle ? false : true);
                    await buttonReply(interaction, `Shuffle set to ${player.shuffle ? `on` : `off`}.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Shuffle set to ${player.shuffle ? `on` : `off`} by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'PREV_BUT':
                    if (!player.previous) return await buttonReply(interaction, `There is no previous track.`, this.client.color.default);
                    player.previousTrack();
                    await buttonReply(interaction, `Playing the previous track.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Playing the previous track by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'REWIND_BUT':
                    const time = player.player.position - 10000;
                    if (time < 0) return await buttonReply(interaction, `You cannot rewind the music more than the length of the song.`, this.client.color.default);
                    player.seek(time);
                    await buttonReply(interaction, `Rewinded the music.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Rewinded by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                case 'FORWARD_BUT':
                    const time2 = player.player.position + 10000;
                    if (time2 > player.current.info.length) return await buttonReply(interaction, `You cannot forward the music more than the length of the song.`, this.client.color.default);
                    player.seek(time2);
                    await buttonReply(interaction, `Forwarded the music.`, this.client.color.default);
                    await message.edit({ embeds: [embed.setFooter({ text: `Forwarded by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })] });
                    break;
                default:
                    await buttonReply(interaction, `This button is not available.`, this.client.color.default);
                    break;
            }
        }
    }
}