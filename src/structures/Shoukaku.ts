import { Connectors, Shoukaku } from 'shoukaku';

import { Lavamusic } from './index';

export default class ShoukakuClient extends Shoukaku {
    public client: Lavamusic;
    constructor(client: Lavamusic) {
        super(new Connectors.DiscordJS(client), client.config.lavalink, {
            moveOnDisconnect: false,
            resume: false,
            reconnectInterval: 30,
            reconnectTries: 2,
            restTimeout: 10000,
        });
        this.client = client;
        this.on('ready', (name, resumed) =>
            this.client.shoukaku.emit(
                resumed ? 'nodeReconnect' : 'nodeConnect',
                this.client.shoukaku.getNode(name)
            )
        );

        this.on('error', (name, error) => this.client.shoukaku.emit('nodeError', name, error));

        this.on('close', (name, code, reason) =>
            this.client.shoukaku.emit('nodeDestroy', name, code, reason)
        );

        this.on('disconnect', (name, players, moved) => {
            if (moved) this.emit('playerMove', players);
            this.client.shoukaku.emit('nodeDisconnect', name, players);
        });

        this.on('debug', (name, reason) => this.client.shoukaku.emit('nodeRaw', name, reason));
    }
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
