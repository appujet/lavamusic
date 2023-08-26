import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { SERVICES } from '../../utils/constants';
import { IAuthService } from '../interfaces/auth';
import config from '../../../config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(SERVICES.AUTH) private readonly authService: IAuthService,
    ) {
        super({
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: config.dashboard.redirectUri,
            scope: ['identify', 'guilds'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        return this.authService.validateUser({
            userId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            accessToken,
            refreshToken,
        });
    }
}