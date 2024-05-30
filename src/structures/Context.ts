import {
    APIInteractionGuildMember,
    ChatInputCommandInteraction,
    CommandInteraction,
    DMChannel,
    Guild,
    GuildMember,
    GuildMemberResolvable,
    GuildTextBasedChannel,
    Message,
    PartialDMChannel,
    TextChannel,
    User,
} from 'discord.js';

import { Lavamusic } from './index.js';

export default class Context {
    public ctx: CommandInteraction | Message;
    public interaction: CommandInteraction | null;
    public message: Message | null;
    public id: string;
    public channelId: string;
    public client: Lavamusic;
    public author: User | null;
    public channel: PartialDMChannel | GuildTextBasedChannel | TextChannel | DMChannel | null =
        null;
    public guild: Guild | null;
    public createdAt: Date;
    public createdTimestamp: number;
    public member: GuildMemberResolvable | GuildMember | APIInteractionGuildMember | null;
    public args: any[];
    public msg: any;
    constructor(ctx: ChatInputCommandInteraction | Message, args: any[]) {
        this.ctx = ctx;
        this.interaction = this.ctx instanceof ChatInputCommandInteraction ? this.ctx : null;
        this.message = this.ctx instanceof Message ? this.ctx : null;
        this.channel = this.ctx.channel;
        this.id = ctx.id;
        this.channelId = ctx.channelId;
        this.client = ctx.client as Lavamusic;
        this.author = ctx instanceof Message ? ctx.author : ctx.user;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.createdAt = ctx.createdAt;
        this.createdTimestamp = ctx.createdTimestamp;
        this.member = ctx.member;
        this.setArgs(args);
    }

    public get isInteraction(): boolean {
        return this.ctx instanceof ChatInputCommandInteraction;
    }

    public setArgs(args: any[]): void {
        if (this.isInteraction) {
            this.args = args.map((arg: { value: any }) => arg.value);
        } else {
            this.args = args;
        }
    }
    public async sendMessage(content: any): Promise<Message> {
        if (this.isInteraction) {
            this.msg = this.interaction.reply(content);
            return this.msg;
        } else {
            this.msg = await (this.message.channel as TextChannel).send(content);
            return this.msg;
        }
    }
    public async editMessage(content: any): Promise<Message> {
        if (this.isInteraction) {
            if (this.msg) this.msg = await this.interaction.editReply(content);
            return this.msg;
        } else {
            if (this.msg) this.msg = await this.msg.edit(content);
            return this.msg;
        }
    }
    public async sendDeferMessage(content: any): Promise<Message> {
        if (this.isInteraction) {
            this.msg = await this.interaction.deferReply({ fetchReply: true });
            return this.msg;
        } else {
            this.msg = await (this.message.channel as TextChannel).send(content);
            return this.msg;
        }
    }
    public async sendFollowUp(content: any): Promise<void> {
        if (this.isInteraction) {
            await this.interaction.followUp(content);
        } else {
            this.msg = await (this.message.channel as TextChannel).send(content);
        }
    }
    public get deferred(): boolean | Promise<any> {
        if (this.isInteraction) {
            return this.interaction.deferred;
        }

        if (this.msg) return true;

        return false;
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
