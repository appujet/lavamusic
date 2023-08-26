import { AxiosResponse } from 'axios';
import {
    GuildBanType,
    PartialGuild,
    PartialGuildChannel,
} from '../../utils/types';

export interface IDiscordHttpService {
    fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
    fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
    fetchGuildChannels(
        guildId: string,
    ): Promise<AxiosResponse<PartialGuildChannel[]>>;
    fetchGuildBans(guildId: string): Promise<AxiosResponse<GuildBanType[]>>;
    deleteGuildBan(guildId: string, userId: string): Promise<AxiosResponse>;
    
}