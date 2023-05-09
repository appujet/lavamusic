import { Dispatcher } from './index.js';
export class Queue extends Map {
    constructor(client) {
        super();
        this.client = client;
    }
    get(guildId) {
        return super.get(guildId);
    }
    set(guildId, dispatcher) {
        return super.set(guildId, dispatcher);
    }
    delete(guildId) {
        return super.delete(guildId);
    }
    clear() {
        return super.clear();
    }
    async create(guild, voice, channel, givenNode) {
        let dispatcher = this.get(guild.id);
        if (!voice)
            throw new Error('No voice channel was provided');
        if (!channel)
            throw new Error('No text channel was provided');
        if (!guild)
            throw new Error('No guild was provided');
        if (!dispatcher) {
            const node = givenNode || this.client.shoukaku.getNode();
            const player = await node.joinChannel({
                guildId: guild.id,
                channelId: voice.id,
                shardId: guild.shard.id,
                deaf: true,
            });
            dispatcher = new Dispatcher({
                client: this.client,
                guildId: guild.id,
                channelId: channel.id,
                player,
                node,
            });
            this.set(guild.id, dispatcher);
            this.client.shoukaku.emit('playerCreate', dispatcher.player);
            return dispatcher;
        }
        else {
            return dispatcher;
        }
    }
    async search(query) {
        const node = this.client.shoukaku.getNode();
        const regex = /^https?:\/\//;
        let result;
        try {
            result = await node.rest.resolve(regex.test(query) ? query : `${this.client.config.searchEngine}:${query}`);
        }
        catch (err) {
            return null;
        }
        return result;
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
//# sourceMappingURL=Queue.js.map