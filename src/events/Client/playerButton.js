const { EmbedBuilder, Client, ButtonInteraction } = require("discord.js");
const { convertTime } = require("../../utils/convert");
const { buttonReply } = require("../../utils/functions");

module.exports = {
    name: "playerButtons",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {*} data 
     */

    run: async (client, interaction, data) => {
        
        if (!interaction.replied) await interaction.deferReply().catch(() => { });
        const color = client.embedColor;
        if (!interaction.member.voice.channel) return await buttonReply(interaction, `You are not connected to a voice channel to use this button.`, color);
        if (interaction.guild.members.cache.get(client.user.id).voice.channel && interaction.guild.members.cache.get(client.user.id).voice.channelId !== interaction.member.voice.channelId) return await buttonReply(interaction, `You are not connected to ${interaction.guild.me.voice.channel} to use this buttons.`, color);
        const player = interaction.client.manager.get(interaction.guildId);
        
        if(!player) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if(!player.queue) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if(!player.queue.current) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if(player && player.state !== "CONNECTED") {
            player.destroy();
            return await buttonReply(interaction, `Nothing is playing right now.`, color);
        };
        const { title, uri, duration, requester, author } = player.queue.current;

        let message;
        try {

            message = await interaction.channel.messages.fetch(data.Message, { cache: true });

        } catch (e) { };

        let icon = player.queue.current.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.links.img;


        let nowplaying = new EmbedBuilder().setColor(color).setDescription(`[${title}](${uri}) by ${author} • \`[${convertTime(duration)}]\``).setImage(icon).setFooter({ text: `Requested by ${requester.username}`, iconURL: requester.displayAvatarURL({ dynamic: true }) });

        if (interaction.customId === `pause_but_${interaction.guildId}`) {
            if (player.paused) {
                player.pause(false);

                await buttonReply(interaction, `[${title}](${uri}) is now unpaused/resumed.`, color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            } else {
                player.pause(true);

                await buttonReply(interaction, `[${title}](${uri}) is now paused.`,color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            };
        } else if (interaction.customId === `previous_but_${interaction.guildId}`) {
            if (!player) return await buttonReply(interaction, `Process cancled due to player not found.`, color);
            if (!player.queue.previous) return await buttonReply(interaction, `No previously played song found.`, color);

            player.queue.add(player.queue.previous);
            if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

            if (player.queue.size === 1) {
                player.stop();
            } else {
                player.queue.add(player.queue.previous, 0);

                if (player.queue.current.title !== player.queue.previous.title || player.queue.current.uri !== player.queue.previous.uri) player.stop();
            };

            return await buttonReply(interaction, `Now playing [${player.queue.previous.title}](${player.queue.previous.uri})`, color);
        } else if (interaction.customId === `skipbut_but_${interaction.guildId}`) {
            if (!player.queue.size) return await buttonReply(interaction, `No more songs left in the queue to skip.`, color);

            player.stop();
            return await buttonReply(interaction, `Skipped [${title}](${uri})`, color);
        } else if (interaction.customId === `highvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) + 10;
            if (amount >= 200) return await buttonReply(interaction, `Cannot higher the player volume further more.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, ` volume set to \`[ ${player.volume}% ]\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        } else if (interaction.customId === `lowvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) - 10;
            if (amount < 01) return await buttonReply(interaction, `Cannot higher the player volume further more.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, ` volume set to \`[ ${player.volume}% ]\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        } else {
            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });

            return await buttonReply(interaction, `You've choosen an invalid button!`, color);
        };
    }
}
