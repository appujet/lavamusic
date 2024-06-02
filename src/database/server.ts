import {
    type Botchannel,
    type Dj,
    type Guild,
    type Playlist,
    PrismaClient,
    type Role,
    type Setup,
    type Song,
    type Stay,
} from "@prisma/client";

import config from "../config.js";

export default class ServerData {
    F;
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async get(guildId: string): Promise<Guild | null> {
        return (
            (await this.prisma.guild.findUnique({
                where: {
                    guildId,
                },
            })) ?? (await this.createGuild(guildId))
        );
    }

    private async createGuild(guildId: string): Promise<Guild> {
        return await this.prisma.guild.create({
            data: {
                guildId,
                prefix: config.prefix,
            },
        });
    }

    public async setPrefix(guildId: string, prefix: string): Promise<void> {
        await this.prisma.guild.upsert({
            where: {
                guildId,
            },
            update: {
                prefix,
            },
            create: {
                guildId,
                prefix,
            },
        });
    }

    public async set_247(guildId: string, textId: string, voiceId: string): Promise<void> {
        await this.prisma.stay.upsert({
            where: {
                guildId,
            },
            update: {
                textId,
                voiceId,
            },
            create: {
                guildId,
                textId,
                voiceId,
            },
        });
    }

    public async delete_247(guildId: string): Promise<void> {
        await this.prisma.stay.delete({
            where: {
                guildId,
            },
        });
    }

    public async setDj(guildId: string, mode: boolean): Promise<void> {
        await this.prisma.dj.upsert({
            where: {
                guildId,
            },
            update: {
                mode,
            },
            create: {
                guildId,
                mode,
            },
        });
    }

    public async get_247(guildId?: string): Promise<Stay | Stay[]> {
        if (guildId) {
            return await this.prisma.stay.findUnique({
                where: {
                    guildId,
                },
            });
        }
        return await this.prisma.stay.findMany();
    }

    public async getDj(guildId: string): Promise<Dj | null> {
        return await this.prisma.dj.findUnique({
            where: {
                guildId,
            },
        });
    }

    public async getRoles(guildId: string): Promise<Role[]> {
        return await this.prisma.role.findMany({
            where: {
                guildId,
            },
        });
    }

    public async addRole(guildId: string, roleId: string): Promise<void> {
        await this.prisma.role.create({
            data: {
                guildId,
                roleId,
            },
        });
    }

    public async removeRole(guildId: string, roleId: string): Promise<void> {
        await this.prisma.role.deleteMany({
            where: {
                guildId,
                roleId,
            },
        });
    }

    public async clearRoles(guildId: string): Promise<void> {
        await this.prisma.role.deleteMany({
            where: {
                guildId,
            },
        });
    }

    public async getBotChannel(guildId: string): Promise<Botchannel | null> {
        return await this.prisma.botchannel.findUnique({
            where: {
                guildId,
            },
        });
    }

    public async setBotChannel(guildId: string, textId: string): Promise<void> {
        await this.prisma.botchannel.upsert({
            where: {
                guildId,
            },
            update: {
                textId,
            },
            create: {
                guildId,
                textId,
            },
        });
    }

    public async getSetup(guildId: string): Promise<Setup | null> {
        return await this.prisma.setup.findUnique({
            where: {
                guildId,
            },
        });
    }

    public async setSetup(guildId: string, textId: string, messageId: string): Promise<void> {
        await this.prisma.setup.upsert({
            where: {
                guildId,
            },
            update: {
                textId,
                messageId,
            },
            create: {
                guildId,
                textId,
                messageId,
            },
        });
    }

    public async deleteSetup(guildId: string): Promise<void> {
        await this.prisma.setup.delete({
            where: {
                guildId,
            },
        });
    }

    public async getPlaylist(userId: string, name: string): Promise<Playlist | null> {
        return await this.prisma.playlist.findUnique({
            where: {
                userId_name: {
                    userId,
                    name,
                },
            },
        });
    }

    public async createPlaylist(userId: string, name: string): Promise<void> {
        await this.prisma.playlist.create({
            data: {
                userId,
                name,
            },
        });
    }

    public async deletePlaylist(userId: string, name: string): Promise<void> {
        await this.prisma.playlist.delete({
            where: {
                userId_name: {
                    userId,
                    name,
                },
            },
        });
    }

    public async addSong(userId: string, name: string, song: string): Promise<void> {
        const playlist = await this.getPlaylist(userId, name);
        if (playlist) {
            await this.prisma.song.create({
                data: {
                    track: JSON.stringify(song),
                    playlistId: playlist.id,
                },
            });
        } else {
            await this.createPlaylist(userId, name);
            await this.addSong(userId, name, song);
        }
    }

    public async removeSong(userId: string, name: string, song: string): Promise<void> {
        const playlist = await this.getPlaylist(userId, name);
        if (playlist) {
            await this.prisma.song.delete({
                where: {
                    track_playlistId: {
                        track: song,
                        playlistId: playlist.id,
                    },
                },
            });
        }
    }

    public async getSongs(userId: string, name: string): Promise<Song[]> {
        const playlist = await this.getPlaylist(userId, name);
        if (playlist) {
            return await this.prisma.song.findMany({
                where: {
                    playlistId: playlist.id,
                },
            });
        }
        return [];
    }

    public async clearPlaylist(userId: string, name: string): Promise<void> {
        const playlist = await this.getPlaylist(userId, name);
        if (playlist) {
            await this.prisma.song.deleteMany({
                where: {
                    playlistId: playlist.id,
                },
            });
        }
    }

    public async clearPlaylists(userId: string): Promise<void> {
        await this.prisma.playlist.deleteMany({
            where: {
                userId,
            },
        });
    }

    public async clearAllPlaylists(): Promise<void> {
        await this.prisma.playlist.deleteMany();
    }

    public async clearAllSongs(): Promise<void> {
        await this.prisma.song.deleteMany();
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
