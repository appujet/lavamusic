import Lavamusic from "./Lavamusic.js";
import { ApplicationCommandOption, PermissionResolvable } from "discord.js";

export default class Command {
  public client: Lavamusic;
  public name: string;
  public nameLocalizations: any;
  public description: {
    content: string | null;
    usage: string | null;
    examples: string[] | null;
  };
  public descriptionLocalizations: any | null;
  public aliases: string[];
  public cooldown: number;
  public args: boolean;
  public player: {
    voice: boolean;
    dj: boolean;
    active: boolean;
    djPerm: string | null;
  };
  public permissions: {
    dev: boolean;
    client: string[] | PermissionResolvable;
    user: string[] | PermissionResolvable;
  };
  public slashCommand: boolean;
  public options: ApplicationCommandOption[];
  public category: string | null;
  constructor(client: Lavamusic, options: CommandOptions) {
    this.client = client;
    this.name = options.name;
    this.nameLocalizations = options.nameLocalizations;
    this.description = {
      content: options.description
        ? options.description.content || "No description provided"
        : "No description provided",
      usage: options.description ? options.description.usage || "No usage provided" : "No usage provided",
      examples: options.description ? options.description.examples || [""] : [""],
    };
    this.descriptionLocalizations = options.descriptionLocalizations;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || 3;
    this.args = options.args || false;
    this.player = {
      voice: options.player ? options.player.voice || false : false,
      dj: options.player ? options.player.dj || false : false,
      active: options.player ? options.player.active || false : false,
      djPerm: options.player ? options.player.djPerm || null : null,
    };
    this.permissions = {
      dev: options.permissions ? options.permissions.dev || false : false,
      client: options.permissions ? options.permissions.client || [] : ["SendMessages", "ViewChannel", "EmbedLinks"],
      user: options.permissions ? options.permissions.user || [] : [],
    };
    this.slashCommand = options.slashCommand || false;
    this.options = options.options || [];
    this.category = options.category || "general";
  }
  public async run(client: Lavamusic, message: any, args: string[]) {
    return Promise.resolve();
  }
}

interface CommandOptions {
  name: string;
  nameLocalizations?: any;
  description?: {
    content: string;
    usage: string;
    examples: string[];
  };
  descriptionLocalizations?: any;
  aliases?: string[];
  cooldown?: number;
  args?: boolean;
  player?: {
    voice: boolean;
    dj: boolean;
    active: boolean;
    djPerm: string | null;
  };
  permissions?: {
    dev: boolean;
    client: string[] | PermissionResolvable;
    user: string[] | PermissionResolvable;
  };
  slashCommand?: boolean;
  options?: ApplicationCommandOption[];
  category?: string;
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
