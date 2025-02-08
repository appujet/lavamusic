import {
  type Dj,
  type Guild,
  type Playlist,
  PrismaClient,
  type Role,
  type Setup,
  type Stay,
} from "@prisma/client";
import { env } from "../env";
import { Base64, Track } from "lavalink-client";

export default class ServerData {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async get(guildId: string): Promise<Guild> {
    return (
      (await this.prisma.guild.findUnique({ where: { guildId } })) ??
      this.createGuild(guildId)
    );
  }

  private async createGuild(guildId: string): Promise<Guild> {
    return await this.prisma.guild.create({
      data: {
        guildId,
        prefix: env.PREFIX,
      },
    });
  }

  public async setPrefix(guildId: string, prefix: string) {
    return await this.prisma.guild.upsert({
      where: { guildId },
      update: { prefix },
      create: { guildId, prefix },
    });
  }

  public async getPrefix(guildId: string): Promise<string> {
    const guild = await this.get(guildId);
    return guild?.prefix ?? env.PREFIX;
  }

  public async updateLanguage(
    guildId: string,
    language: string,
  ): Promise<void> {
    await this.prisma.guild.update({
      where: { guildId },
      data: { language },
    });
  }

  public async getLanguage(guildId: string): Promise<string> {
    const guild = await this.get(guildId);
    return guild?.language ?? env.DEFAULT_LANGUAGE;
  }

  public async getSetup(guildId: string): Promise<Setup | null> {
    return await this.prisma.setup.findUnique({ where: { guildId } });
  }

  public async setSetup(
    guildId: string,
    textId: string,
    messageId: string,
  ): Promise<void> {
    await this.prisma.setup.upsert({
      where: { guildId },
      update: { textId, messageId },
      create: { guildId, textId, messageId },
    });
  }

  public async deleteSetup(guildId: string): Promise<void> {
    await this.prisma.setup.delete({ where: { guildId } });
  }

  public async set_247(
    guildId: string,
    textId: string,
    voiceId: string,
  ): Promise<void> {
    await this.prisma.stay.upsert({
      where: { guildId },
      update: { textId, voiceId },
      create: { guildId, textId, voiceId },
    });
  }

  public async delete_247(guildId: string): Promise<void> {
    await this.prisma.stay.delete({ where: { guildId } });
  }

  public async get_247(guildId?: string): Promise<Stay | Stay[] | null> {
    if (guildId) {
      //return await this.prisma.stay.findUnique({ where: { guildId } });
      const stay = await this.prisma.stay.findUnique({ where: { guildId } });
      if (stay) return stay;
      return null;
    }
    return this.prisma.stay.findMany();
  }

  public async setDj(guildId: string, mode: boolean) {
    return await this.prisma.dj.upsert({
      where: { guildId },
      update: { mode },
      create: { guildId, mode },
    });
  }

  public async getDj(guildId: string): Promise<Dj | null> {
    return await this.prisma.dj.findUnique({ where: { guildId } });
  }

  public async getRoles(guildId: string): Promise<Role[]> {
    return await this.prisma.role.findMany({ where: { guildId } });
  }

  public async addRole(guildId: string, roleId: string): Promise<void> {
    await this.prisma.role.create({ data: { guildId, roleId } });
  }

  public async removeRole(guildId: string, roleId: string): Promise<void> {
    await this.prisma.role.deleteMany({ where: { guildId, roleId } });
  }

  public async clearRoles(guildId: string): Promise<void> {
    await this.prisma.role.deleteMany({ where: { guildId } });
  }
  public async getPlaylist(userId: string, name: string, create = false) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { userId_name: { userId, name } },
    });

    if (!playlist && create) {
      return await this.createPlaylist(userId, name);
    }

    return playlist;
  }

  public async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return await this.prisma.playlist.findMany({
      where: { userId },
    });
  }

  public async createPlaylist(userId: string, name: string): Promise<Playlist> {
    return await this.prisma.playlist.create({ data: { userId, name } });
  }

  /**
   * Deletes a playlist from the database
   *
   * @param userId The ID of the user that owns the playlist
   * @param name The name of the playlist to delete
   */
  public async deletePlaylist(userId: string, name: string): Promise<void> {
    await this.prisma.playlist.delete({
      where: { userId_name: { userId, name } },
    });
  }

  public async deletePlaylistById(userId: string, id: string) {
    return await this.prisma.playlist.delete({
      where: { id, userId },
    });
  }

  public async deleteSongsFromPlaylist(
    userId: string,
    playlistName: string,
  ): Promise<void> {
    // Fetch the playlist
    const playlist = await this.getPlaylist(userId, playlistName);

    if (playlist) {
      // Update the playlist and reset the tracks to an empty array
      await this.prisma.playlist.update({
        where: {
          userId_name: {
            userId,
            name: playlistName,
          },
        },
        data: {
          tracks: {
            set: [],
          },
        },
      });
    }
  }

  public async addTracksToPlaylist(
    userId: string,
    playlistName: string,
    tracks: Track[],
  ) {
    // Check if the playlist already exists for the user
    const playlist = await this.prisma.playlist.findUnique({
      where: {
        userId_name: {
          userId,
          name: playlistName,
        },
      },
      include: {
        tracks: true,
      },
    });

    if (playlist) {
      // Add the new tracks to the existing playlist
      return await this.prisma.playlist.update({
        where: {
          userId_name: {
            userId,
            name: playlistName,
          },
        },
        data: {
          tracks: {
            connectOrCreate: tracks.map((track) => ({
              where: { identifier: track.info.identifier! },
              create: {
                identifier: track.info.identifier!,
                encoded: track.encoded!,
              },
            })),
          },
        },
      });
    } else {
      // Create a new playlist with the new tracks
      return await this.prisma.playlist.create({
        data: {
          userId,
          name: playlistName,
          tracks: {
            connectOrCreate: tracks.map((track) => ({
              where: { identifier: track.info.identifier! },
              create: {
                identifier: track.info.identifier!,
                encoded: track.encoded!,
              },
            })),
          },
        },
      });
    }
  }

  public async removeSong(
    userId: string,
    playlistName: string,
    encodedSong: Base64,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: {
        userId_name: {
          userId,
          name: playlistName,
        },
      },
      include: {
        tracks: true,
      },
    });
    if (playlist) {
      const tracks = playlist.tracks;

      // Find the index of the song to remove
      const index = tracks.findIndex((track) => track.encoded === encodedSong);
      if (index !== -1) {
        // Remove the song from the array
        tracks.splice(index, 1);
        return await this.prisma.playlist.update({
          where: {
            userId_name: {
              userId,
              name: playlistName,
            },
          },
          data: {
            tracks: {
              set: tracks,
            },
          },
        });
      }
    }
    return null;
  }

  public async getTracksFromPlaylist(userId: string, playlistName: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: {
        userId_name: {
          userId,
          name: playlistName,
        },
      },
      include: {
        tracks: true, // Ensures tracks are fetched with the playlist
      },
    });

    if (!playlist) {
      return null;
    }

    return playlist.tracks;
  }

  public async updateTrackHistory(
    track: Track,
    guildId: string,
    userId?: string,
    botId?: string,
  ) {
    // Handle Track
    await this.prisma.track.upsert({
      where: { identifier: track.info.identifier! },
      update: {
        played: { increment: 1 },
        lastPlayed: new Date(),
      },
      create: {
        identifier: track.info.identifier!,
        encoded: track.encoded!,
        played: 1,
        lastPlayed: new Date(),
      },
    });

    // Handle Guild history
    if (guildId) {
      const guild = await this.prisma.guild.findUnique({
        where: { guildId },
      });

      if (guild) {
        const guildTrackExists = await this.prisma.guild.findFirst({
          where: {
            guildId,
            history: {
              some: { identifier: track.info.identifier! },
            },
          },
        });

        if (!guildTrackExists) {
          await this.prisma.guild.update({
            where: { guildId },
            data: {
              history: {
                connect: { identifier: track.info.identifier! },
              },
            },
          });
        }
      } else {
        // Create Guild and connect track
        await this.prisma.guild.create({
          data: {
            guildId,
            prefix: env.PREFIX,
            history: {
              connect: { identifier: track.info.identifier! },
            },
          },
        });
      }
    }

    // Handle User history
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (user) {
        const userTrackExists = await this.prisma.user.findFirst({
          where: {
            userId,
            history: {
              some: { identifier: track.info.identifier! },
            },
          },
        });

        if (!userTrackExists) {
          await this.prisma.user.update({
            where: { userId },
            data: {
              history: {
                connect: { identifier: track.info.identifier! },
              },
            },
          });
        }
      } else {
        // Create User and connect track
        await this.prisma.user.create({
          data: {
            userId,
            history: {
              connect: { identifier: track.info.identifier! },
            },
          },
        });
      }
    }

    // Handle Bot history
    if (botId) {
      const bot = await this.prisma.bot.findUnique({
        where: { botId },
      });

      if (bot) {
        const botTrackExists = await this.prisma.bot.findFirst({
          where: {
            botId,
            history: {
              some: { identifier: track.info.identifier! },
            },
          },
        });

        if (!botTrackExists) {
          await this.prisma.bot.update({
            where: { botId },
            data: {
              history: {
                connect: { identifier: track.info.identifier! },
              },
            },
          });
        }
      } else {
        // Create Bot and connect track
        await this.prisma.bot.create({
          data: {
            botId,
            history: {
              connect: { identifier: track.info.identifier! },
            },
          },
        });
      }
    }
  }

  public async getTopPlayedTracksPast24Hours(guildId: string) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Get the guild's history with the count of how many times tracks have been played in the past 24 hours
    const guildHistory = await this.prisma.guild.findUnique({
      where: { guildId },
      include: {
        history: {
          where: {
            lastPlayed: {
              gte: twentyFourHoursAgo,
            },
          },
          orderBy: {
            played: "desc",
          },
        },
      },
    });

    if (guildHistory) {
      return guildHistory.history;
    } else {
      return [];
    }
  }

  public async getBotTopPlayedTracks(botId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { botId },
      include: {
        history: {
          orderBy: {
            played: "desc",
          },
        },
      },
    });

    if (bot) {
      return bot.history;
    } else {
      return [];
    }
  }

  public async getUserTopPlayedTracks(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: {
            played: "desc",
          },
        },
      },
    });

    if (user) {
      return user.history;
    } else {
      return [];
    }
  }

  public async getLastPlayedTrack(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        history: {
          where: {
            lastPlayed: {
              lte: new Date(),
            },
          },
          orderBy: {
            lastPlayed: "desc",
          },
        },
      },
    });

    if (user) {
      return user.history[0];
    } else {
      return null;
    }
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
