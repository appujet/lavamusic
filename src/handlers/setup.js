import Setup from '../schemas/setup.js';
import { formatTime, checkURL } from './functions.js';
import { getButtons } from './playerButtons.js';


async function getSetup(guildId) {
    let data = await Setup.findOne({ _id: guildId });
    return data;
}
/**
 * 
 * @param {import('discord.js').EmbedData} embed
 * @param {import('shoukaku').PlayOptions} player
 * @param {import('../structures/Client.js').BotClient} client
 * @returns 
 */
function neb(embed, player, client) {
    let icon = player.current ? player.displayThumbnail(player.current) : client.config.links.img;
    return embed
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
    const isURL = checkURL(query);
    const data = await getSetup(message.guild.id);
    try {
        if (data) m = await message.channel.messages.fetch({ message: data.Message, cache: true });
    } catch (error) {
        console.log(error);
    }
    if (m) {
        let res = await client.manager.search(isURL ? query : `ytmsearch:${query}`);
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
        const embed = client.embed()
            .setColor(client.color.default)
            .setDescription(`[${track.info.title}](${track.info.uri}) by ${track.info.author} • \`[${formatTime(track.info.length)}]\``)
            .setImage(icon)
        await m.edit({ embeds: [embed] }).catch(() => { });
    } else {
        const embed = client.embed()
            .setColor(client.color.default)
            .setDescription(`[${track.info.title}](${track.info.uri}) by ${track.info.author} • \`[${formatTime(track.info.length)}]\``)
            .setImage(icon)
        const button = await getButtons()
        await channel.send({ embeds: [embed], components: [button] });
    }
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} int
 * @param {string[]} args
 * @param {import('../structures/Client.js').BotClient} client
 */
async function buttonReply(int, args, client) {
    const embed = client.embed()
    if (int.replied) {
        await int.editReply({ embeds: [embed.setColor(client.color.default).setDescription(args)] }).catch(() => { });
    } else {
        await int.followUp({ embeds: [embed.setColor(client.color.default).setDescription(args)] }).catch(() => { });
    }
}

export {
    setupStart,
    trackStart,
    getSetup,
    buttonReply
}
