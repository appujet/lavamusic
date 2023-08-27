import { AxiosResponse } from 'axios';
import { PartialGuildChannel } from '../../utils/types';

export interface IDiscordService {
    getBotGuilds();
    getUserGuilds(accessToken: string);
    getMutualGuilds(accessToken: string);
    getGuildChannels(
        guildId: string,
    ): Promise<AxiosResponse<PartialGuildChannel[]>>;
    getUserDetails(accessToken: string): Promise<AxiosResponse<any>>;
}