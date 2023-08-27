import { fetch } from "undici";
import { DISCORD_API_URL } from "../../types/types";
import config from "../../../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getBotGuildsService() {
    let res = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bot ${config.token}`
        }
    });
    let data = await res.json();
    return data;
}

export async function getUserGuildsService(id: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    });

    let res = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${user.accessToken}`
        }
    });
    let data = await res.json();
    return data;
}

export async function getGuild(guildId: string) {
    let res = await fetch(`${DISCORD_API_URL}/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${config.token}`
        }
    });
    let data = await res.json();
    return data;
}

export async function getGuildChannels(guildId: string) {
    let res = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${config.token}`
        
        }
    });
    let data = await res.json();
    return data;
}


