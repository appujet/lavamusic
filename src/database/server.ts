/* import Database from 'better-sqlite3';

import config from '../config.js';

const db = new Database('./lavamusic.db', {
    fileMustExist: false,
    readonly: false,
});
db.pragma('journal_mode=WAL');

export default class ServerData {
    constructor() {
        this.intialize();
    }
    public intialize(): void {
        db.prepare(
            'CREATE TABLE IF NOT EXISTS guild (guildId TEXT PRIMARY KEY, prefix TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS stay (guildId TEXT PRIMARY KEY, textId TEXT, voiceId TEXT)'
        ).run();
        db.prepare('CREATE TABLE IF NOT EXISTS dj (guildId TEXT PRIMARY KEY, mode BOOLEAN)').run();
        db.prepare('CREATE TABLE IF NOT EXISTS roles (guildId TEXT, roleId TEXT)').run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS playlist (userId TEXT, name TEXT, songs TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS botchannel (guildId TEXT PRIMARY KEY, textId TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS setup (guildId TEXT PRIMARY KEY, textId TEXT, messageId TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS premium (userId TEXT PRIMARY KEY, guildId TEXT)'
        ).run();
    }
    public get(guildId: string): any {
        let data = db.prepare('SELECT * FROM guild WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO guild (guildId) VALUES (?)').run(guildId);
            data = db.prepare('SELECT * FROM guild WHERE guildId = ?').get(guildId);
        }
        return data;
    }

    public setPrefix(guildId: string, prefix: string): void {
        const data: any = db.prepare('SELECT * FROM guild WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO guild (guildId, prefix) VALUES (?, ?)').run(guildId, prefix);
        } else {
            db.prepare('UPDATE guild SET prefix = ? WHERE guildId = ?').run(prefix, guildId);
        }
    }

    public set_247(guildId: string, textId: string, voiceId: string): void {
        let data = db.prepare('SELECT * FROM stay WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO stay (guildId, textId, voiceId) VALUES (?, ?, ?)').run(
                guildId,
                textId,
                voiceId
            );
        } else {
            db.prepare('UPDATE stay SET textId = ?, voiceId = ? WHERE guildId = ?').run(
                textId,
                voiceId,
                guildId
            );
        }
    }

    public delete_247(guildId: string): void {
        const data: any = db.prepare('SELECT * FROM stay WHERE guildId = ?').get(guildId);
        if (!data) return;
        db.prepare('DELETE FROM stay WHERE guildId = ?').run(guildId);
    }

    public setDj(guildId: string, mode: boolean): void {
        const modeNum = mode ? 1 : 0;
        let data = db.prepare('SELECT * FROM dj WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO dj (guildId, mode) VALUES (?, ?)').run(guildId, modeNum);
        } else {
            db.prepare('UPDATE dj SET mode = ? WHERE guildId = ?').run(modeNum, guildId);
        }
    }

    public getPrefix(guildId: string): any {
        const data: any = db.prepare('SELECT * FROM guild WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO guild (guildId, prefix) VALUES (?, ?)').run(
                guildId,
                config.prefix
            );
            return {
                prefix: config.prefix,
            };
        } else {
            return data;
        }
    }

    public get_247(guildId?: string): any {
        if (guildId) {
            const data: any = db.prepare('SELECT * FROM stay WHERE guildId = ?').get(guildId);
            if (!data) {
                return false;
            } else {
                return data;
            }
        } else {
            const data: any = db.prepare('SELECT * FROM stay').all();
            if (!data) {
                return false;
            } else {
                return data;
            }
        }
    }

    public getDj(guildId: string): any {
        const data: any = db.prepare('SELECT * FROM dj WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO dj (guildId) VALUES (?)').run(guildId);
            return false;
        } else {
            return data;
        }
    }

    public getRoles(guildId: string): any {
        const data: any = db.prepare('SELECT * FROM roles WHERE guildId = ?').all(guildId);
        if (!data) {
            return false;
        } else {
            return data;
        }
    }

    public addRole(guildId: string, roleId: string): void {
        const data: any = db
            .prepare('SELECT * FROM roles WHERE guildId = ? AND roleId = ?')
            .get(guildId, roleId);
        if (!data) {
            db.prepare('INSERT INTO roles (guildId, roleId) VALUES (?, ?)').run(guildId, roleId);
        }
    }

    public removeRole(guildId: string, roleId: string): void {
        const data: any = db
            .prepare('SELECT * FROM roles WHERE guildId = ? AND roleId = ?')
            .get(guildId, roleId);
        if (data) {
            db.prepare('DELETE FROM roles WHERE guildId = ? AND roleId = ?').run(guildId, roleId);
        }
    }
    public clearRoles(guildId: string): void {
        const data: any = db.prepare('SELECT * FROM roles WHERE guildId = ?').all(guildId);
        if (data) {
            db.prepare('DELETE FROM roles WHERE guildId = ?').run(guildId);
        }
    }
    public getBotChannel(guildId: string): any {
        const data: any = db.prepare('SELECT * FROM botchannel WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO botchannel (guildId) VALUES (?)').run(guildId);
            return false;
        } else {
            return data;
        }
    }

    public setBotChannel(guildId: string, textId: string): void {
        let data = db.prepare('SELECT * FROM botchannel WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO botchannel (guildId, textId) VALUES (?, ?)').run(
                guildId,
                textId
            );
        } else {
            db.prepare('UPDATE botchannel SET textId = ? WHERE guildId = ?').run(textId, guildId);
        }
    }

    public getSetup(guildId: string): any {
        const data: any = db.prepare('SELECT * FROM setup WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO setup (guildId) VALUES (?)').run(guildId);
            return false;
        } else {
            return data;
        }
    }

    public setSetup(guildId: string, textId: string, messageId: string): void {
        let data = db.prepare('SELECT * FROM setup WHERE guildId = ?').get(guildId);
        if (!data) {
            db.prepare('INSERT INTO setup (guildId, textId, messageId) VALUES (?, ?, ?)').run(
                guildId,
                textId,
                messageId
            );
        } else {
            db.prepare('UPDATE setup SET textId = ?, messageId = ? WHERE guildId = ?').run(
                textId,
                messageId,
                guildId
            );
        }
    }

    public deleteSetup(guildId: string): void {
        const data: any = db.prepare('SELECT * FROM setup WHERE guildId = ?').get(guildId);
        if (!data) return;
        db.prepare('DELETE FROM setup WHERE guildId = ?').run(guildId);
    }

    public getUser(userId: string): any {
        const data: any = db.prepare('SELECT * FROM user WHERE userId = ?').get(userId);
        if (!data) {
            db.prepare('INSERT INTO user (userId) VALUES (?)').run(userId);
            return false;
        } else {
            return data;
        }
    }
    public getPLaylist(userId: string, name: string): any {
        const data: any = db
            .prepare('SELECT * FROM playlist WHERE userId = ? AND name = ?')
            .get(userId, name);
        if (!data) {
            return false;
        } else {
            return data;
        }
    }
    public createPlaylist(userId: string, name: string): void {
        const data: any = db
            .prepare('SELECT * FROM playlist WHERE userId = ? AND name = ?')
            .get(userId, name);
        if (!data) {
            db.prepare('INSERT INTO playlist (userId, name) VALUES (?, ?)').run(userId, name);
        } else {
            throw new Error('Playlist already exists');
        }
    }

    public deletePlaylist(userId: string, name: string): void {
        const data: any = db
            .prepare('SELECT * FROM playlist WHERE userId = ? AND name = ?')
            .get(userId, name);
        if (data) {
            db.prepare('DELETE FROM playlist WHERE userId = ? AND name = ?').run(userId, name);
        } else {
            throw new Error('Playlist does not exist');
        }
    }

    public addSong(userId: string, name: string, song: string): void {
        const data: any = db
            .prepare('SELECT * FROM playlist WHERE userId = ? AND name = ?')
            .get(userId, name);
        if (data) {
            const existingSongs = JSON.parse(data.songs || '[]');
            const updatedSongs = existingSongs.concat(song);
            db.prepare('UPDATE playlist SET songs = ? WHERE userId = ? AND name = ?').run(
                JSON.stringify(updatedSongs),
                userId,
                name
            );
        } else {
            throw new Error('Playlist does not exist');
        }
    }

    public removeSong(userId: string, name: string, song: string): void {
        const data: any = db
            .prepare('SELECT * FROM playlist WHERE userId = ? AND name = ?')
            .get(userId, name);
        if (data) {
            db.prepare('UPDATE playlist SET songs = ? WHERE userId = ? AND name = ?').run(
                JSON.stringify(data.songs.filter((s: string) => s !== song)),
                userId,
                name
            );
        } else {
            throw new Error('Playlist does not exist');
        }
    }
}
 */

import { PrismaClient, Guild, Playlist, Dj, Role, Botchannel, Setup, Stay, Song, } from '@prisma/client';
import config from '../config.js';

export default class ServerData {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async get(guildId: string): Promise<Guild | null> {
        const data = await this.prisma.guild.findUnique({
            where: {
                guildId,
            },
        });
        if (!data) {
            await this.prisma.guild.create({
                data: {
                    guildId,
                    prefix: config.prefix,
                },
            });
            return null;
        }
        return data;
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

    public async getPrefix(guildId: string): Promise<Guild | null> {
        const data = await this.get(guildId);
        if (!data) {
            return {
                guildId,
                prefix: config.prefix,
            };
        } else {
            return data;
        }
    }

    public async get_247(guildId?: string): Promise<Stay | Stay[]> {
        if (guildId) {
            return await this.prisma.stay.findUnique({
                where: {
                    guildId,
                },
            });
        } else {
            return await this.prisma.stay.findMany();
        }
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
        await this.prisma.role.upsert({
            where: {
                guildId_roleId: {
                    guildId,
                    roleId,
                },
            },
            update: {},
            create: {
                guildId,
                roleId,
            },
        });
    }

    public async removeRole(guildId: string, roleId: string): Promise<void> {
        await this.prisma.role.delete({
            where: {
                guildId_roleId: {
                    guildId,
                    roleId,
                },
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

    public async getPLaylist(userId: string, name: string): Promise<Playlist | null> {
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
    /* model Playlist {
  id     String @id @default(dbgenerated())
  userId String
  name   String
  songs  Song[]

  @@unique([userId, name])
}

model Song {
  id         String   @id @default(dbgenerated())
  track      String
  playlistId String
  playlist   Playlist @relation(fields: [playlistId], references: [id])
}
 */
    public async addSong(userId: string, name: string, song: string): Promise<void> {
        const playlist = await this.getPLaylist(userId, name);
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
        const playlist = await this.getPLaylist(userId, name);
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

    public async getSong(userId: string, name: string): Promise<Song[]> {
        const playlist = await this.getPLaylist(userId, name);
        if (playlist) {
            const songs = await this.prisma.song.findMany({
                where: {
                    playlistId: playlist.id,
                },
            });
            return songs;
        }
        return [];
    }

    public async clearPlaylist(userId: string, name: string): Promise<void> {
        const playlist = await this.getPLaylist(userId, name);
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






