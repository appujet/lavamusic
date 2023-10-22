import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as DiscordStrategy, Profile } from 'passport-discord';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VerifyCallback } from 'passport-oauth2';

import config from '../../config';

export default class DiscordPassportStrategy {
    private prisma = new PrismaClient();
    constructor() {
        this.initializeStrategy();
    }

    initializeStrategy(): void {
        passport.serializeUser((user: any, done) => {
            done(null, user.id);
        });
        passport.deserializeUser(async (id: string, done) => {
            try {
                const user = await this.prisma.user.findFirst({
                    where: {
                        id: id,
                    },
                });
                return user ? done(null, user) : done(null, null);
            } catch (error) {
                console.log(error);
                done(error, null);
            }
        });
        passport.use(
            new DiscordStrategy(
                {
                    clientID: config.clientId,
                    clientSecret: config.clientSecret,
                    callbackURL: config.dashboard.redirectUri,
                    scope: ['identify', 'guilds'],
                },
                this.verifyCallback.bind(this)
            )
        );
    }

    async verifyCallback(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ): Promise<void> {
        const { id: userId, username, discriminator, avatar } = profile;
        let existingUser = await this.prisma.user.findFirst({
            where: {
                userId: userId,
                accessToken: accessToken,
            },
        });
        try {
            if (existingUser) {
                if (existingUser.refreshToken !== refreshToken) {
                    existingUser = await this.prisma.user.update({
                        where: {
                            id: existingUser.id,
                        },
                        data: {
                            refreshToken: refreshToken,
                        },
                    });
                }
                return done(null, existingUser);
            } else {
                const newUser = await this.prisma.user.create({
                    data: {
                        userId: userId,
                        username: username,
                        discriminator: discriminator,
                        avatar: avatar,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                });
                return done(null, newUser);
            }
        } catch (error) {
            console.log(error);
            return done(error, null);
        }
    }
}
