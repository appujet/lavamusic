import { PrismaClient } from '../../prisma/prisma.client.new';
import type { Dj, GuildConfig } from '../../prisma/prisma.client.new';
// import { env } from '../env';

export default class ServerData {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	public async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
		return this.prisma.guildConfig.findUnique({ where: { GuildId: guildId } });
	}

	public async createGuildConfig(guildId: string, config: GuildConfig['Config']): Promise<GuildConfig> {
		return this.prisma.guildConfig.create({ data: { GuildId: guildId, Config: config as any } });
	}

	public async updateGuildConfig(guildId: string, config: GuildConfig['Config']): Promise<GuildConfig> {
		return this.prisma.guildConfig.update({ where: { GuildId: guildId }, data: { Config: config as any } });
	}

	public async getGuildDj(guildId: string): Promise<Dj | null> {
		return this.prisma.dj.findUnique({ where: { Guild: guildId } });
	}

	public async createGuildDj(guildId: string, dj: Pick<Dj, 'Mode' | 'Roles'>): Promise<Dj> {
		return this.prisma.dj.create({ data: { Guild: guildId, ...dj } });
	}

	public async updateGuildDj(guildId: string, dj: Pick<Dj, 'Mode' | 'Roles'>): Promise<Dj> {
		return this.prisma.dj.update({ where: { Guild: guildId }, data: dj });
	}

	public async deleteGuildDj(guildId: string): Promise<void> {
		await this.prisma.dj.delete({ where: { Guild: guildId } });
	}
}

