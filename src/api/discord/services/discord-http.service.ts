import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios, { AxiosResponse } from 'axios';
import {
    PartialGuild,
    PartialGuildChannel,
} from '../../utils/types';
import { DISCORD_BASE_URL } from '../../utils/constants';
import config from '../../../config';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
    fetchBotGuilds() {
        return axios.get<PartialGuild[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${config.token}`,
            },
        });
    }

    fetchUserGuilds(accessToken: string) {
        return axios.get<PartialGuild[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    fetchGuildChannels(guildId: string) {
        return axios.get<PartialGuildChannel[]>(
            `${DISCORD_BASE_URL}/guilds/${guildId}/channels`,
            {
                headers: {
                    Authorization: `Bot ${config.token}`,
                },
            },
        );
    }
    fetchUserDetails(accessToken: string) {
        return axios.get(`${DISCORD_BASE_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}