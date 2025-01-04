import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { getUserGuilds } from "../lib/fetch/requests";
import { PermissionFlagsBits, PermissionsBitField } from "discord.js";

export class GuildService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  public async getUserGuilds(token: string) {
    const userGuild = await getUserGuilds(token!);
    const filteredGuild = userGuild.map((g: any) => {
      return {
        id: g.id,
        name: g.name,
        icon: g.icon,
        manageGuild: new PermissionsBitField(BigInt(g.permissions)).has(
          PermissionFlagsBits.ManageGuild
        ),
        botState: {
          isJoined: Boolean(this.client.guilds.cache.get(g.id)),
        },
      };
    });
    return filteredGuild;
  }

  public async getGuild(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return null;
    return {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
    };
  }

  public async getChannels(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return null;

    return {
      channels: guild.channels.cache,
    };
  }
}
