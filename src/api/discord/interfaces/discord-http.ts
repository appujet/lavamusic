import { AxiosResponse } from 'axios';
import {
    PartialGuild,
    PartialGuildChannel,
} from '../../utils/types';

export interface IDiscordHttpService {
    fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
    fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
    fetchGuildChannels(
        guildId: string,
    ): Promise<AxiosResponse<PartialGuildChannel[]>>;
    fetchUserDetails(accessToken: string): Promise<AxiosResponse<any>>;
}