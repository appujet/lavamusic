import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Guild } from "@prisma/client";

@WebSocketGateway()
export class WebsocketHandler {
    @WebSocketServer()
    ws: Server;

    @SubscribeMessage('guilds')
    guildsHandler(@MessageBody() data: any) {
        console.log(data);
    }

    guildPrefixUpdate(config: Guild) {
        this.ws.emit('guildPrefixUpdate', config);
    }
}