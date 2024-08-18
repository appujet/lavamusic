import { Connectors, type NodeOption, Shoukaku } from "shoukaku";
import type { Lavamusic } from "./index.js";

export default class ShoukakuClient extends Shoukaku {
    public client: Lavamusic;
    constructor(client: Lavamusic, nodes: NodeOption[]) {
        super(new Connectors.DiscordJS(client), nodes, {
            moveOnDisconnect: false,
            resume: false,
            reconnectInterval: 30,
            reconnectTries: 2,
            restTimeout: 10000,
            userAgent: "Lavamusic (@appujet)", // don't change this
            nodeResolver: (nodes) =>
                [...nodes.values()]
                    .filter((node) => node.state === 2)
                    .sort((a, b) => a.penalties - b.penalties)
                    .shift(),
        });
        this.client = client;
        this.on("ready", (name, reconnected) => {
            this.client.shoukaku.emit(reconnected ? "nodeReconnect" : ("nodeConnect" as any), name);
        });
        this.on("error", (name, error) => {
            this.client.shoukaku.emit("nodeError" as any, name, error);
        });
        this.on("close", (name, code, reason) => {
            this.client.shoukaku.emit("nodeDestroy" as any, name, code, reason);
        });
        this.on("disconnect", (name, count) => {
            this.client.shoukaku.emit("nodeDisconnect" as any, name, count);
        });
        this.on("debug", (name, reason) => {
            this.client.shoukaku.emit("nodeRaw" as any, name, reason);
        });
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