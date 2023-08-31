import { DISCORD_API_URL } from "../../types/types";
import config from "../../../config";
import { PrismaClient } from "@prisma/client";
import { fetch } from "undici";


const prisma = new PrismaClient();
export async function getBotGuildsService() {
    return await fetchRequest(`${DISCORD_API_URL}/users/@me/guilds`, `Bot ${config.token}`);
}

export async function getUserGuildsService(id: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    });
    return await fetchRequest(`${DISCORD_API_URL}/users/@me/guilds`, `Bearer ${user.accessToken}`);
}

export async function getMutualGuildsService(id: string) {
    const botGuilds = await getBotGuildsService(); 
    const userGuilds = await getUserGuildsService(id);
    const adminUserGuilds = userGuilds.filter(({ permissions }) => (parseInt(permissions) & 0x8) === 0x8);
    return adminUserGuilds.filter((guild) => {
        return botGuilds.some((botGuild) => botGuild.id === guild.id);
    });
}

export async function getGuild(guildId: string) {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}`, `Bot ${config.token}`);
}

export async function getGuildChannels(guildId: string) {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}/channels`, `Bot ${config.token}`);
}

export async function getGuildRoles(guildId: string) {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}/roles`, `Bot ${config.token}`);
}

export async function getGuildMembers(guildId: string) {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}/members`, `Bot ${config.token}`);
}

export async function getGuildMember(guildId: string, userId: string) {
    return await fetchRequest(`${DISCORD_API_URL}/guilds/${guildId}/members/${userId}`, `Bot ${config.token}`);
}

export async function fetchRequest(url: string, auth): Promise<any> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: auth
        }
    });
    return await response.json();
}


