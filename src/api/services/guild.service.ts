import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { getUser, getUserGuilds } from "../lib/fetch/requests";
import { PermissionFlagsBits, PermissionsBitField, Role } from "discord.js";
import { Base64 } from "lavalink-client";

export class GuildService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  public async getUserGuilds(token: string) {
    const [userGuilds, restUser] = await Promise.all([
      getUserGuilds(token),
      getUser(token),
    ]);

    const filteredGuilds = await Promise.all(
      userGuilds.map(async (g: any) => {
        // Fetch the guild only if necessary
        const guildPromise = this.client.guilds.fetch(g.id).catch(() => null);

        // Fetch DJ mode and roles in parallel
        const [dj, guild] = await Promise.all([
          this.client.db.getDj(g.id),
          guildPromise,
        ]);

        const djRolePromise = dj?.mode
          ? this.client.db.getRoles(g.id)
          : Promise.resolve(null);

        const [djRole, user] = await Promise.all([
          djRolePromise,
          guild?.members.fetch(restUser.id).catch(() => null),
        ]);

        const hasDjRole = user?.roles.cache.some((role) =>
          djRole?.some((r) => r.roleId === role.id),
        );

        const permissions = new PermissionsBitField(g.permissions);
        const formattedPermission = permissions.has(
          PermissionFlagsBits.Administrator,
        )
          ? "Administrator"
          : permissions.has(PermissionFlagsBits.ManageGuild)
            ? "Manage Guild"
            : hasDjRole
              ? "DJ"
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
      }),
    );

    return filteredGuilds;
  }

  public async getGuild(accessToken: string, guildId: string) {
    const [restUser, guild] = await Promise.all([
      getUser(accessToken),
      this.client.guilds.fetch(guildId).catch(() => null),
    ]);

    if (!guild) return null;

    const [user, prefix, dj, roles] = await Promise.all([
      guild.members.fetch(restUser.id).catch(() => null),
      this.client.db.getPrefix(guildId),
      this.client.db.getDj(guildId),
      this.client.db.getRoles(guildId),
    ]);

    return {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.ownerId,
      prefix,
      roles: guild.roles.cache
        .filter((role) => !role.managed)
        .map((role) => this.formatRole(role)),
      dj: {
        mode: dj?.mode,
        roles: roles
          .map((r) => {
            const role = guild.roles.cache.get(r.roleId);
            if (!role) return null;
            return this.formatRole(role);
          })
          .filter((role) => role !== null),
      },
      permissions: user?.permissions?.toArray(),
    };
  }
  private formatRole(role: Role) {
    return {
      id: role.id,
      name: role.name,
      color: role.color,
      hoist: role.hoist,
      icon: role.icon,
      unicode_emoji: role.unicodeEmoji,
      position: role.position,
      permissions: role.permissions.toArray(),
      managed: role.managed,
      mentionable: role.mentionable,
      flags: role.flags,
      tags: role.tags,
    };
  }
  public async getChannels(accessToken: string, guildId: string) {
    const guild = await this.client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return null;
    const restUser = await getUser(accessToken);
    const user = await guild.members.fetch(restUser.id).catch(() => null);
    if (!user) return null;

    const channels = guild.channels.cache.filter((channel) => {
      const permissions = channel.permissionsFor(user);
      return (
        permissions.has("ViewChannel") &&
        permissions.has("SendMessages") &&
        permissions.has("Connect")
      );
    });

    return {
      channels: channels,
    };
  }

  public async getTopPlayedTracksPast24Hours(
    guildId: string,
    accessToken: string,
  ) {
    const guild = await this.client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return null;
    const restUser = await getUser(accessToken);
    const user = await guild.members.fetch(restUser.id).catch(() => null);
    const data = await this.client.db.getTopPlayedTracksPast24Hours(guildId);
    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const tracks = await node.decode.multipleTracks(
      data.map((t) => t.encoded) as Base64[],
      user,
    );

    return tracks;
  }

  public async updateGuildSettings(
    accessToken: string,
    guildId: string,
    body: any,
  ) {
    const [guild, restUser] = await Promise.all([
      this.client.guilds.fetch(guildId).catch(() => null),
      getUser(accessToken),
    ]);

    if (!guild) return null;

    const user = await guild.members.fetch(restUser.id).catch(() => null);
    if (!user) return null;

    // Update DJ mode and prefix in parallel
    await Promise.all([
      this.client.db.setDj(guildId, body.isDjOnly),
      this.client.db.setPrefix(guildId, body.prefix),
    ]);

    const djRoles = await this.client.db.getRoles(guildId);

    // Determine added and removed DJ roles
    const addedDjRoles = body.djRoles.filter(
      (role: any) => !djRoles.some((r: any) => r.roleId === role.id),
    );
    const removedDjRoles = djRoles.filter(
      (role: any) => !body.djRoles.some((r: any) => r.id === role.roleId),
    );

    // Perform role updates in parallel
    await Promise.all([
      ...addedDjRoles.map((role: any) =>
        this.client.db.addRole(guildId, role.id),
      ),
      ...removedDjRoles.map((role: any) =>
        this.client.db.removeRole(guildId, role.roleId),
      ),
    ]);

    return true;
  }
}
