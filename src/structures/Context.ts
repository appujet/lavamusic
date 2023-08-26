import {
  CommandInteraction,
  GuildMemberResolvable,
  Message,
  APIInteractionGuildMember,
  Guild,
  GuildMember,
  TextChannel,
  User,
  PartialDMChannel,
  GuildTextBasedChannel,
  DMChannel
} from 'discord.js';
import { Lavamusic } from './index';

export default class Context {
  public ctx: CommandInteraction | Message;
  public isInteraction: boolean;
  public interaction: CommandInteraction | null;
  public message: Message | null;
  public id: string;
  public channelId: string;
  public client: Lavamusic;
  public author: User | null;
  public channel: PartialDMChannel | GuildTextBasedChannel | TextChannel | DMChannel | any | null = null;
  public guild: Guild | null;
  public createdAt: Date;
  public createdTimestamp: number;
  public member: GuildMemberResolvable | GuildMember | APIInteractionGuildMember | null;
  public args: any[];
  public msg: any;
  constructor(ctx, args) {
    this.ctx = ctx;
    this.isInteraction = ctx instanceof CommandInteraction;
    this.interaction = this.isInteraction ? ctx : null;
    this.message = this.isInteraction ? null : ctx;
    this.id = ctx.id;
    this.channelId = ctx.channelId;
    this.client = ctx.client;
    this.author = ctx instanceof Message ? ctx.author : ctx.user;
    this.channel = ctx.channel;
    this.guild = ctx.guild;
    this.createdAt = ctx.createdAt;
    this.createdTimestamp = ctx.createdTimestamp;
    this.member = ctx.member;
    this.setArgs(args);
  }
  setArgs(args: any[]) {
    if (this.isInteraction) {
      this.args = args.map((arg: { value: any }) => arg.value);
    } else {
      this.args = args;
    }
  }
  public async sendMessage(content: any) {
    if (this.isInteraction) {
      this.msg = this.interaction.reply(content);
      return this.msg;
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
      return this.msg;
    }
  }
  public async editMessage(content) {
    if (this.isInteraction) {
      if (this.msg) this.msg = await this.interaction.editReply(content);
      return this.msg;
    } else {
      if (this.msg) this.msg = await this.msg.edit(content);
      return this.msg;
    }
  }
  public async sendDeferMessage(content) {
    if (this.isInteraction) {
      this.msg = await this.interaction.deferReply({ fetchReply: true });
      return this.msg;
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
      return this.msg;
    }
  }
  public async sendFollowUp(content) {
    if (this.isInteraction) {
      await this.interaction.followUp(content);
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
    }
  }
  public get deferred() {
    if (this.isInteraction) {
      return this.interaction.deferred;
    }

    if (this.msg) return true;

    return false;
  }
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
