import { Module } from '@nestjs/common';
import { WebsocketHandler } from './socket';

@Module({
    providers: [WebsocketHandler],
    exports: [WebsocketHandler],
})
export class WebSocketModule { }