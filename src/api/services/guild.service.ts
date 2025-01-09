import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { getUser, getUserGuilds } from "../lib/fetch/requests";
import { PermissionsBitField } from "discord.js";
import { Base64 } from "lavalink-client";

export class GuildService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  public async getUserGuilds(token: string) {
    const userGuild = await getUserGuilds(token!);

    const filteredGuild = userGuild.map((g: any) => {
      const permissions = new PermissionsBitField(g.permissions);
      const formattedPermission = permissions.has("Administrator")
        ? "Administrator"
        : permissions.has("ManageGuild")
          ? "Manage Guild"
          : "Member";
      return {
        id: g.id,
        name: g.name,
        icon: g.icon,
        permissions: formattedPermission,
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

  public async getTopPlayedTracksPast24Hours(guildId: string, accessToken: string) {
    const guild = await this.client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return null;
    const restUser = await getUser(accessToken);
    const user = await guild.members.fetch(restUser.id).catch(() => null);
    const data = await this.client.db.getTopPlayedTracksPast24Hours(guildId);
    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const tracks = await node.decode.multipleTracks(
      data.map((t) => t.encoded) as Base64[],
      user
    );

    return tracks;
  }
}
