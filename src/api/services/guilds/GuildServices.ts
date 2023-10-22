import { PrismaClient } from '@prisma/client';
import { fetch } from 'undici';

import config from '../../../config';
import { DISCORD_API_URL } from '../../types/types';

const prisma = new PrismaClient();
export async function getBotGuildsService(): Promise<any> {
    return await fetchRequest(`${DISCORD_API_URL}/users/@me/guilds`, `Bot ${config.token}`);
}

export async function getUserGuildsService(id: string): Promise<any> {
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
    });
    return await fetchRequest(`${DISCORD_API_URL}/users/@me/guilds`, `Bearer ${user.accessToken}`);
}

export async function getMutualGuildsService(id: string): Promise<any> {
    const botGuilds = await getBotGuildsService();
    const userGuilds = await getUserGuildsService(id);
    const adminUserGuilds = userGuilds.filter(
        ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    );
    return adminUserGuilds.filter(guild => {
        return botGuilds.some(botGuild => botGuild.id === guild.id);
    });
}

export async function getGuild(guildId: string): Promise<any> {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}`, `Bot ${config.token}`);
}

export async function getGuildChannels(guildId: string): Promise<any> {
    return await fetchRequest(
        `${DISCORD_API_URL}/guilds/${guildId}/channels`,
        `Bot ${config.token}`
    );
}

export async function getGuildRoles(guildId: string): Promise<any> {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}/roles`, `Bot ${config.token}`);
}

export async function getGuildMembers(guildId: string): Promise<any> {
    return await fetchRequest(
        `${DISCORD_API_URL}/guilds/${guildId}/members`,
        `Bot ${config.token}`
    );
}

export async function getGuildMember(guildId: string, userId: string): Promise<any> {
    return await fetchRequest(
        `${DISCORD_API_URL}/guilds/${guildId}/members/${userId}`,
        `Bot ${config.token}`
    );
}

export async function fetchRequest(url: string, auth: string): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: auth,
        },
    });
    return await response.json();
}
