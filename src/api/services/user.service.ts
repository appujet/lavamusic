import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { Base64, LavalinkNode } from "lavalink-client";
import { User } from "discord.js";
import { getUser } from "../lib/fetch/requests";

export class UserService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  getUser(userId: string) {
    return this.client.users.cache.get(userId);
  }

  public async getRecommendedTracks(accessToken: string) {
    const restUser = await getUser(accessToken);
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
        user
      );
      return res.tracks;
    },
    youtube: async (node: LavalinkNode, identifier: string, user: User) => {
      const res = await node.search(
        {
          query: `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`,
          source: "youtube",
        },
        user
      );
      return res.tracks;
    },
    jiosaavn: async (node: LavalinkNode, identifier: string, user: User) => {
      const res = await node.search(
        {
          query: `jsrec:${identifier}`,
          source: "jsrec",
        },
        user
      );
      return res.tracks;
    },
  };

  public async getPlaylist(accessToken: string, name: string) {
    const restUser = await getUser(accessToken);
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return null;
   
    const playlist = await this.client.db.getPlaylist(user.id, name); 
    if (!playlist) return null;
    const tracks = JSON.parse(playlist.tracks!);
    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const decodedTracks = await node.decode.multipleTracks(
      tracks.map((t: any ) => t.encoded) as Base64[],
      user
    );
    return {
      name: playlist.name,
      tracks: decodedTracks
    };
  }
}
