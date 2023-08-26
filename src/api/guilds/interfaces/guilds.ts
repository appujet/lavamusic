import { Guild } from "@prisma/client";

export interface IGuildsService {
    getGuildConfig(guildId: string): Promise<Guild>;
    updateGuildPrefix(
        guildId: string,
        prefix: string,
    ): Promise<Guild>;
}