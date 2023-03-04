import { Node, Shoukaku, Connectors } from "shoukaku";
import { EventEmitter } from "events";
import { Collection, TextChannel, User } from "discord.js";
import Dispatcher from "./Dispatcher.js";
import { Lavamusic } from "./index.js";

export default class ShoukakuClient extends EventEmitter {
    public client: Lavamusic;
    public shoukaku: Shoukaku;
    public players: Collection<string, Dispatcher>;
    public spotify: any

    constructor(client: Lavamusic) {
        super();
        this.client = client;
        this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this.client),
            this.client.config.lavalink,
            {
                moveOnDisconnect: false,
                resume: false,
                reconnectInterval: 30,
                reconnectTries: 2,
                restTimeout: 10000,
            },
        );
        this.players = new Collection();
        this.spotify = null;
        this.shoukaku.on('ready', (name, resumed) =>
            this.emit(
                resumed ? 'nodeReconnect' : 'nodeConnect',
                this.shoukaku.getNode(name),
            ),
        );

        this.shoukaku.on('error', (name, error) =>
            this.emit('nodeError', this.shoukaku.getNode(name), error),
        );

        this.shoukaku.on('close', (name, code, reason) =>
            this.emit('nodeDestroy', this.shoukaku.getNode(name), code, reason),
        );

        this.shoukaku.on('disconnect', (name, players, moved) => {
            if (moved) this.emit('playerMove', players);
            this.emit('nodeDisconnect', this.shoukaku.getNode(name), players);
        });

        this.shoukaku.on('debug', (name, reason) =>
            this.emit('nodeRaw', name, reason),
        );
    }

    public getPlayer(guildId: string) {
        return this.players.get(guildId);
    }

    public async create(guild: any, member: any, channel: TextChannel, givenNode: Node) {
        const existing = this.getPlayer(guild.id);

        if (existing) return existing;

        const node = givenNode || this.shoukaku.getNode();

        const player = await node.joinChannel({
            guildId: guild.id,
            shardId: guild.shardId,
            channelId: member.voice.channelId,
            deaf: true,
        });

        const dispatcher = new Dispatcher(this.client, guild, channel, player, member.user);

        this.emit('playerCreate', dispatcher.player);

        this.players.set(guild.id, dispatcher);

        return dispatcher;
    }


    public async search(query: string, options: { requester: User; }) {
        const node = this.shoukaku.getNode();
        const regex = /^https?:\/\//;
        if (regex.test(query)) {
            return await this.fetchURL(query, options);
        } else {
            let result: any;
            try {
                result = await node.rest.resolve(`ytsearch:${query}`);
            } catch (err) {
                return null;
            }
            return result;
        }
    }
    public async fetchURL(query: any, options: any) {
        if (this.spotify.checkURL(query)) {
            return await this.spotify.resolve(query, options);
        } else {
            const node = this.shoukaku.getNode();
            let result: any;
            try {
                result = await node.rest.resolve(`ytsearch:${query}`);
            } catch (err) {
                return null;
            }

            return result;
        }
    }
};

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */