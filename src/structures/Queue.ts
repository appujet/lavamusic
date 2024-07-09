import type { Guild } from "discord.js";
import type { LavalinkResponse, Node } from "shoukaku";
import { Dispatcher, type Lavamusic } from "./index.js";

export class Queue extends Map<string, Dispatcher> {
    public client: Lavamusic;

    constructor(client: Lavamusic) {
        super();
        this.client = client;
    }

    public override get(guildId: string): Dispatcher | undefined {
        return super.get(guildId);
    }

    public override set(guildId: string, dispatcher: Dispatcher): this {
        return super.set(guildId, dispatcher);
    }

    public override delete(guildId: string): boolean {
        return super.delete(guildId);
    }

    public override clear(): void {
        super.clear();
    }

    public async create(guild: Guild, voice: any, channel: any, givenNode?: Node): Promise<Dispatcher> {
        if (!voice) throw new Error("No voice channel was provided");
        if (!channel) throw new Error("No text channel was provided");
        if (!guild) throw new Error("No guild was provided");

        let dispatcher = this.get(guild.id);
        if (!dispatcher) {
            const node = givenNode ?? this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
            const player = await this.client.shoukaku.joinVoiceChannel({
                guildId: guild.id,
                channelId: voice.id,
                shardId: guild.shardId,
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
            this.client.shoukaku.emit("playerCreate", dispatcher.player);
        }
        return dispatcher;
    }

    public async search(query: string): Promise<LavalinkResponse | null> {
        const node = this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
        const searchQuery = /^https?:\/\//.test(query) ? query : `${this.client.config.searchEngine}:${query}`;
        try {
            return await node.rest.resolve(searchQuery);
        } catch (err) {
            console.error("Error during search:", err);
            return null;
        }
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
