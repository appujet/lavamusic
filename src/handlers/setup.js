import { EmbedBuilder } from 'discord.js';
import Setup from '../schemas/setup.js';
import { formatTime, checkURL } from './functions.js';
import { getButtons } from './playerButtons.js';


async function getSetup(guildId) {
    let data = await Setup.findOne({ _id: guildId });
    return data;
}
/**
 * 
 * @param {import('discord.js').EmbedBuilder} embed
 * @param {import('shoukaku').PlayOptions} player
 * @param {import('../structures/Client.js').BotClient} client
 * @returns 
 */
function neb(embed, player, client) {
    let iconUrl = client.config.icons[player.current.info.sourceName];
    if (!iconUrl) iconUrl = client.user.defaultAvatarURL({ dynamic: true })

    let icon = player.current ? player.displayThumbnail(player.current) : client.config.links.img;
    return embed
        .setAuthor({ name: 'Now Playing', iconURL: iconUrl })
        .setDescription(`[${player.current.info.title}](${player.current.info.uri}) by ${player.current.info.author} • \`[${formatTime(player.current.info.length)}]\``)
        .setImage(icon)
       // .setFooter({ text: `Requested by ${player.current.info.requester.tag}`, iconURL: player.current.info.requester.displayAvatarURL({ dynamic: true }) });
}
/**
 * @param {import('../structures/Client.js').BotClient} client
 * @param {import('discord.js').Message} query
 * @param {import('shoukaku').ShoukakuPlayer} player
 * @param {import('discord.js').Message} message
 * @returns
 */
async function setupStart(client, query, player, message) {
    let m;
    const embed = client.embed()
    let n = client.embed().setColor(client.color.default);

    const data = await getSetup(message.guild.id);
    try {
        if (data) m = await message.channel.messages.fetch({ message: data.Message, cache: true });
    } catch (error) {
        console.log(error);
    }
    if (m) {
        try {
            let res = await client.manager.search(query, { requester: message.author })
        switch (res.loadType) {
            case 'LOAD_FAILED':
                message.channel.send({ embeds: [embed.setColor(client.color.error).setDescription('There was an error while searching.')] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
                break;
            case 'NO_MATCHES':
                await message.channel.send({ embeds: [embed.setColor(client.color.error).setDescription('There were no results found.')] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
                break;
            case 'TRACK_LOADED':
                player.queue.push(res.tracks[0]);
                await player.isPlaying()
                await message.channel.send({ embeds: [embed.setColor(client.color.default).setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`)] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
                neb(n, player, client);
                if (m) await m.edit({ embeds: [n] }).catch(() => { });
                break;
            case 'PLAYLIST_LOADED':
                player.queue.push(...res.tracks);
                await player.isPlaying()
                await message.channel.send({ embeds: [embed.setColor(client.color.default).setDescription(`Added [${res.tracks.length}](${res.tracks[0].info.uri}) to the queue.`)] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
                neb(n, player, client);
                if (m) await m.edit({ embeds: [n] }).catch(() => { });
                break;
            case 'SEARCH_RESULT':
                player.queue.push(res.tracks[0]);
                await player.isPlaying()
                await message.channel.send({ embeds: [embed.setColor(client.color.default).setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`)] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
                neb(n, player, client);
                if (m) await m.edit({ embeds: [n] }).catch(() => { });
                break;
            }
        } catch (error) {
            await message.channel.send({ embeds: [embed.setColor(client.color.error).setDescription('There was an error while searching.')] }).then((msg) => { setTimeout(() => { msg.delete() }, 5000)});
        }
    }
}

/**
 * 
 * @param {import('discord.js').Message} msgId
 * @param {import('discord.js').TextChannel} channel
 * @param {import('shoukaku').Player} player
 * @param {import('shoukaku').Track} track
 * @param {import('../structures/Client.js').BotClient} client
 */
async function trackStart(msgId, channel, player, track, client) {
    let icon = player.current ? player.displayThumbnail(player.current) : client.config.links.img;
    let m;
    try {
        m = await channel.messages.fetch({ message: msgId, cache: true });
    } catch (error) {
        console.log(error);
    }
    if (m) {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = client.user.defaultAvatarURL({ dynamic: true })
        const embed = client.embed()
            .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
            .setColor(client.color.default)
            .setDescription(`[${track.info.title}](${track.info.uri}) - \`[${formatTime(track.info.length)}]\``)
            .setImage(icon)
        await m.edit({ embeds: [embed] }).catch(() => { });
    } else {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = client.user.defaultAvatarURL({ dynamic: true })
        const embed = client.embed()
            .setColor(client.color.default)
            .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
            .setDescription(`[${track.info.title}](${track.info.uri}) - \`[${formatTime(track.info.length)}]\``)
            .setImage(icon)
        const button = await getButtons()
        await channel.send({ embeds: [embed], components: button });
    }
}


/**
 * 
 * @param {import('discord.js').CommandInteraction} int
 * @param {string[]} args
 * @param {import('../structures/Client.js').BotClient} client
 */
async function buttonReply(int, args, color) {
    const embed = new EmbedBuilder()
    if (int.replied) {
        await int.editReply({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    } else {
        await int.followUp({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    }
    setTimeout(async () => {
        if (int && !int.ephemeral) {
            await int.deleteReply().catch(() => { });
        }
    }, 2000);
}

export {
    setupStart,
    trackStart,
    getSetup,
    buttonReply
}
