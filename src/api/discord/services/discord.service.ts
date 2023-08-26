import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { SERVICES } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { IDiscordHttpService } from '../interfaces/discord-http';

@Injectable()
export class DiscordService implements IDiscordService {
    constructor(
        @Inject(SERVICES.DISCORD_HTTP)
        private readonly discordHttpService: IDiscordHttpService,
    ) { }

    getBotGuilds() {
        return this.discordHttpService.fetchBotGuilds();
    }
    getUserGuilds(accessToken: string) {
        return this.discordHttpService.fetchUserGuilds(accessToken);
    }
    async getMutualGuilds(accessToken: string) {
        const { data: userGuilds } = await this.getUserGuilds(accessToken);
        const { data: botGuilds } = await this.getBotGuilds();
        const adminUserGuilds = userGuilds.filter(
            ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8,
        );
        console.log(adminUserGuilds);
        const mutualGuilds = userGuilds.filter((guild) =>
            botGuilds.some((botGuild) => botGuild.id === guild.id),
        );
        return mutualGuilds;
    }

    getGuildChannels(guildId: string) {
        return this.discordHttpService.fetchGuildChannels(guildId);
    }

    getGuildBans(guildId: string) {
        return this.discordHttpService.fetchGuildBans(guildId);
    }

    deleteGuildBan(guildId: string, userId: string): Promise<AxiosResponse> {
        return this.discordHttpService.deleteGuildBan(guildId, userId);
    }
}