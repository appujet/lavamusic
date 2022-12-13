import { Node, Shoukaku, Connectors } from "shoukaku";
import { EventEmitter } from "events";
import { Collection, Guild } from "discord.js";
import Dispatcher from "./Dispatcher.js";

export default class ShoukakuClient extends EventEmitter {
    /**
     * @param {import('./Client.js').BotClient} client
     */
    constructor(client) {
        super();
        /**
         * @type {import('./Client.js').BotClient}
         */
        this.client = client;
        /**
         * @type {Shoukaku}
         */
        this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this.client),
            this.client.config.nodes,
            {
                moveOnDisconnect: false,
                resumable: false,
                resumableTimeout: 30,
                reconnectTries: 2,
                restTimeout: 10000,
            },
        );
        /**
         * @type {Collection<string, Dispatcher>}
         */
        this.players = new Collection();
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
    /**
     * 
     * @param {Guild} guildId 
     * @returns 
     */
    getPlayer(guildId) {
        return this.players.get(guildId);
    }
    /**
      *
      * @param { Guild } guild Guild
      * @param { GuildMember } member Member
      * @param { TextChannel } channel Channel
      * @param { Node } givenNode Node
      * @returns { Promise < Dispatcher >}
      */
    async create(guild, member, channel, givenNode) {
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

    /**
     *
     * @param {string} query
     * @returns {Promise<import('shoukaku').LavalinkResponse>}
     */
    async search(query) {
        const node = await this.shoukaku.getNode();

        /**
         * @type {import('shoukaku').LavalinkResponse}
         */
        let result;
        try {
            result = await node.rest.resolve(query);
        } catch (err) {
            return null;
        }

        return result;
    }
}