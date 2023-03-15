import { Collection, ClientOptions, Client, EmbedBuilder } from "discord.js";
import Logger from "./Logger.js";
import { ShoukakuClient, Queue } from "./index.js";
import { Utils } from "../utils/Utils.js";
import { PrismaClient } from '@prisma/client';
export default class Lavamusic extends Client {
    commands: Collection<string, any>;
    aliases: Collection<string, any>;
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation>;
    cooldowns: Collection<string, any>;
    config: {
        token: string;
        prefix: string;
        color: {
            red: number;
            green: number;
            blue: number;
            yellow: number;
            main: number;
        };
        searchEngine: string;
        maxPlaylistSize: number;
        maxQueueSize: number;
        owners: string[];
        database: string;
        clientId: string;
        guildId: string;
        production: true;
        lavalink: {
            url: string;
            auth: string;
            name: string;
            secure: boolean;
        }[];
    };
    logger: Logger;
    readonly color: {
        red: number;
        green: number;
        blue: number;
        yellow: number;
        main: number;
    };
    private body;
    shoukaku: ShoukakuClient;
    utils: typeof Utils;
    queue: Queue;
    constructor(options: ClientOptions);
    embed(): EmbedBuilder;
    start(token: string): Promise<string>;
    private loadCommands;
    private loadEvents;
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
