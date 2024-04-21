import { Guild } from 'discord.js';
import { LavalinkResponse, Node } from 'shoukaku';

import { Dispatcher, Lavamusic } from './index.js';
export class Queue extends Map {
    public client: Lavamusic;
    constructor(client: Lavamusic) {
        super();
        this.client = client;
    }
    public get(guildId: string): Dispatcher {
        return super.get(guildId);
    }
    public set(guildId: string, dispatcher: Dispatcher): this {
        return super.set(guildId, dispatcher);
    }
    public delete(guildId: string): boolean {
        return super.delete(guildId);
    }
    public clear(): void {
        return super.clear();
    }

    public async create(
        guild: Guild,
        voice: any,
        channel: any,
        givenNode?: Node
    ): Promise<Dispatcher> {
        let dispatcher = this.get(guild.id);
        if (!voice) throw new Error('No voice channel was provided');
        if (!channel) throw new Error('No text channel was provided');
        if (!guild) throw new Error('No guild was provided');
        if (!dispatcher) {
            const node =
                givenNode || this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
            const player = await this.client.shoukaku.joinVoiceChannel({
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
        } else {
            return dispatcher;
        }
    }

    public async search(query: string): Promise<LavalinkResponse | undefined> {
        const node = this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
        const regex = /^https?:\/\//;
        let result: LavalinkResponse | undefined;
        try {
            result = await node.rest.resolve(
                regex.test(query) ? query : `${this.client.config.searchEngine}:${query}`
            );
        } catch (err) {
            return null;
        }
        return result;
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
