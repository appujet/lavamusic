import { CommandInteraction, GuildMemberResolvable, Message, APIInteractionGuildMember, Guild, GuildMember, TextChannel, GuildChannel, User } from "discord.js";
import { Lavamusic } from './index.js';
export default class Context {
    ctx: CommandInteraction | Message;
    isInteraction: boolean;
    interaction: CommandInteraction | null;
    message: Message | null;
    id: string;
    channelId: string;
    client: Lavamusic;
    author: User | null;
    channel: GuildChannel | TextChannel | null;
    guild: Guild | null;
    createdAt: Date;
    createdTimestamp: number;
    member: GuildMemberResolvable | GuildMember | APIInteractionGuildMember | null;
    args: any[];
    msg: any;
    constructor(ctx: any, args: any);
    setArgs(args: any[]): void;
    sendMessage(content: any): Promise<any>;
    editMessage(content: any): Promise<any>;
    sendDeferMessage(content: any): Promise<any>;
    sendFollowUp(content: any): Promise<void>;
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
