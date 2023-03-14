import { Node } from "shoukaku";
import { Lavamusic, Dispatcher } from "./index.js";
import { Guild } from 'discord.js';
export declare class Queue extends Map {
    client: Lavamusic;
    constructor(client: Lavamusic);
    get(guildId: string): Dispatcher;
    set(guildId: string, dispatcher: Dispatcher): this;
    delete(guildId: string): boolean;
    clear(): void;
    create(guild: Guild, voice: any, channel: any, givenNode?: Node): Promise<Dispatcher>;
    search(query: string): Promise<any>;
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
