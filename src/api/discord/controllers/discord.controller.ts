import { Controller, Delete, Get, Inject, Param } from '@nestjs/common';
import { ROUTES, SERVICES } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { User } from '@prisma/client';
import { IDiscordService } from '../interfaces/discord';

@Controller(ROUTES.DISCORD)
export class DiscordController {
    constructor(
        @Inject(SERVICES.DISCORD) private readonly discordService: IDiscordService,
    ) { }

    @Get('guilds')
    getMutualGuilds(@AuthUser() user: User) {
        return this.discordService.getMutualGuilds(user.accessToken);
    }

    @Get('guilds/:guildId/channels')
    async getGuildChannels(@Param('guildId') guildId: string) {
        const { data } = await this.discordService.getGuildChannels(guildId);
        return data.filter((channel) => channel.type === 0);
    }

    @Get('user/:userId')
    getUserDetails(@Param('userId') userId: string) {
        return this.discordService.getUserDetails(userId);
    }

}