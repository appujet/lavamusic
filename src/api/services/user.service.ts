import { container, injectable } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { Base64, LavalinkNode, Track } from "lavalink-client";
import { User } from "discord.js";
import { discordApiService } from "../fetch/discord";

@injectable()
export class UserService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  getUser(userId: string) {
    return this.client.users.cache.get(userId);
  }

  public async getRecommendedTracks(accessToken: string) {
    const restUser = await discordApiService(accessToken).usersMe();
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return [];
    const lastPlayedTrack = await this.client.db.getLastPlayedTrack(user.id);

    if (!lastPlayedTrack) return [];
    const encoded = lastPlayedTrack.encoded as Base64;

    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];

    if (!node || !node.connected || !encoded) return [];
    const track = await node.decode.singleTrack(encoded, user);
    switch (track.info.sourceName) {
      case "spotify":
        return this.recommendTracks.spotify(node, track.info.identifier, user);
      case "youtube":
      case "youtubemusic":
        return this.recommendTracks.youtube(node, track.info.identifier, user);
      case "jiosaavn":
        return this.recommendTracks.jiosaavn(node, track.info.identifier, user);
      default:
        return this.recommendTracks.youtube(node, track.info.identifier, user);
    }
  }

  private recommendTracks = {
    spotify: async (node: LavalinkNode, identifier: string, user: User) => {
      const res = await node.search(
        {
          query: `seed_tracks=${identifier}`,
          source: "sprec",
        },
        user,
      );
      return res.tracks;
    },
    youtube: async (node: LavalinkNode, identifier: string, user: User) => {
      const res = await node.search(
        {
          query: `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`,
          source: "youtube",
        },
        user,
      );
      return res.tracks;
    },
    jiosaavn: async (node: LavalinkNode, identifier: string, user: User) => {
      const res = await node.search(
        {
          query: `jsrec:${identifier}`,
          source: "jsrec",
        },
        user,
      );
      return res.tracks;
    },
  };

  public async getPlaylist(accessToken: string, name: string) {
    const restUser = await discordApiService(accessToken).usersMe();
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return null;

    const tracks = await this.client.db.getTracksFromPlaylist(user.id, name);
    if (!tracks) return null;
    if (tracks.length === 0) return null;
    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const decodedTracks = await node.decode.multipleTracks(
      tracks.map((t: any) => t.encoded) as Base64[],
      user,
    );
    return {
      name: name,
      tracks: decodedTracks,
    };
  }
  public async getPlaylists(accessToken: string) {
    const restUser = await discordApiService(accessToken).usersMe();
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) {
      return null;
    }

    const playlists = await this.client.db.getUserPlaylists(user.id);
    if (!playlists || playlists.length === 0) {
      return [];
    }

    const playlistsWithTracks = await Promise.all(
      playlists.map(async (playlist) => {
        const tracks =
          (await this.client.db.getTracksFromPlaylist(
            user.id,
            playlist.name,
          )) || [];
        if (tracks.length === 0) {
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: [],
          };
        }

        const nodes = this.client.manager.nodeManager.leastUsedNodes();
        if (!nodes.length) {
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: [],
          };
        }

        const node = nodes[Math.floor(Math.random() * nodes.length)];

        try {
          const decodedTracks = await node.decode.multipleTracks(
            tracks.map((t: any) => t.encoded) as Base64[],
            user,
          );
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: decodedTracks || [],
          };
        } catch (error) {
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: [],
          };
        }
      }),
    );
    return playlistsWithTracks;
  }

  public async toggleLike(accessToken: string, encoded: string) {
    const restUser = await discordApiService(accessToken).usersMe();

    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return null;

    const playlist = await this.client.db.getPlaylist(user.id, "liked", true);

    const tracks = await this.client.db.getTracksFromPlaylist(user.id, "liked");

    const isLiked = tracks?.find((t) => t.encoded === encoded);

    if (isLiked) {
      await this.client.db.removeSong(user.id, "liked", encoded);
    } else {
      const nodes = this.client.manager.nodeManager.leastUsedNodes();
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const decodedTracks = await node.decode.singleTrack(encoded, user);
      await this.client.db.addTracksToPlaylist(user.id, "liked", [
        decodedTracks,
      ]);
    }
    return playlist;
  }
  public async updatePlaylist(
    accessToken: string,
    name: string,
    tracks: Track[],
    type: "add" | "remove" | "rename" | "create" | "delete",
    id: string,
  ) {
    const restUser = await discordApiService(accessToken).usersMe();
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return null;
    if (type === "create") {
      return await this.client.db.createPlaylist(user.id, name);
    } else if (type === "delete" && id) {
      return await this.client.db.deletePlaylistById(user.id, id);
    } else if (type === "add") {
      return await this.client.db.addTracksToPlaylist(user.id, name, tracks);
    } else if (type === "remove") {
      return await this.client.db.removeSong(user.id, name, tracks as any);
    } else if (type === "rename") {
      const playlist = await this.client.db.prisma.playlist.update({
        where: { id: id },
        data: { name: name },
      });
      return playlist;
    }
    return null;
  }
}
