import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DiscordModule } from './discord/discord.module';
import { GuildsModule } from './guilds/guilds.module';
import { WebSocketModule } from './websocket/websocket.module';
@Module({
    imports: [
        AuthModule,
        UserModule,
        DiscordModule,
        GuildsModule,
        WebSocketModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }