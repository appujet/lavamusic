import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
} from '@nestjs/common';
import { ROUTES, SERVICES } from '../../utils/constants';
import { WebsocketHandler } from '../../websocket/socket';
import { IGuildsService } from '../interfaces/guilds';

@Controller(ROUTES.GUILDS)
export class GuildsController {
    constructor(
        @Inject(SERVICES.GUILDS) private readonly guildsService: IGuildsService,
        @Inject(WebsocketHandler) private readonly wsHandler: WebsocketHandler,
    ) { }

    @Get('config/:guildId')
    async getGuildConfig(@Param('guildId') guildId: string) {
        const guildConfig = await this.guildsService.getGuildConfig(guildId);
        if (!guildConfig)
            throw new HttpException(
                'Guild Configuration was not found',
                HttpStatus.NOT_FOUND,
            );
        return guildConfig;
    }

    @Post(':guildId/config/prefix')
    async updateGuildPrefix(
        @Param('guildId') guildId: string,
        @Body('prefix') prefix: string,
    ) {
        const config = await this.guildsService.updateGuildPrefix(guildId, prefix);
        this.wsHandler.guildPrefixUpdate(config);
        return config;
    }
}