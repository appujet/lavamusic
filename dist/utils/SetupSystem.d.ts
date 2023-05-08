import { Message, TextChannel } from "discord.js";
import { Lavamusic, Dispatcher } from "../structures/index.js";
import { Song } from '../structures/Dispatcher.js';
declare function setupStart(client: Lavamusic, query: string, player: Dispatcher, message: Message): Promise<void>;
declare function trackStart(msgId: any, channel: TextChannel, player: Dispatcher, track: Song, client: Lavamusic): Promise<void>;
declare function updateSetup(client: Lavamusic, guild: any): Promise<void>;
declare function buttonReply(int: any, args: any, color: any): Promise<void>;
declare function oops(channel: any, args: any): Promise<void>;
export { setupStart, trackStart, buttonReply, updateSetup, oops };
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
