import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IGuildsService } from '../interfaces/guilds';
import ServerData from '../../../database/server';

@Injectable()
export class GuildsService implements IGuildsService {
    constructor() { }

    async getGuildConfig(guildId: string) {
        return ServerData.get(guildId);
    }
    async updateGuildPrefix(guildId: string, prefix: string) {
        const guildConfig = await this.getGuildConfig(guildId);
        if (!guildConfig)
            throw new HttpException(
                'Guild Configuration was not found',
                HttpStatus.NOT_FOUND,
            );
        return ServerData.setPrefix(guildId, prefix);
    }
}