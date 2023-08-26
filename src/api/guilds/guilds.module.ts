import { Module } from '@nestjs/common';
import { SERVICES } from '../utils/constants';
import { WebSocketModule } from '../websocket/websocket.module';
import { GuildsController } from './controllers/guilds.controller';
import { GuildsService } from './services/guilds.service';

@Module({
    imports: [
        WebSocketModule,
    ],
    controllers: [GuildsController],
    providers: [
        {
            provide: SERVICES.GUILDS,
            useClass: GuildsService,
        },
    ],
})
export class GuildsModule { }