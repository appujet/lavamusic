import type { Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { LavalinkNodeOptions } from 'lavalink-client';
import { testConnection } from '@/utils/lavalink';

class LavalinkController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public officialLavalinks = async (_req: GuildRequest, res: Response): Promise<void> => {
		try {
			const lavalinks = await this.client.dbNew.getOfficialLavalinks();
			if (!lavalinks?.length) {
				response.error(res, 404, 'No official lavalink nodes found');
				return;
			}

			const formattedLavalinks = lavalinks.map(({ NodeAuthorization, ...rest }) => rest);
			response.success(res, { lavalinks: formattedLavalinks });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public getOfficialLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		const { nodeId } = req.params;

		const lavalink = await this.client.dbNew.getOfficialLavalink(nodeId);
		if (!lavalink) {
			response.error(res, 404, `Lavalink node ${nodeId} not found`);
			return;
		}

		const formattedLavalink = { ...lavalink, NodeAuthorization: undefined };
		response.success(res, { lavalink: formattedLavalink });
	};

	public guildLavalinks = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const lavalinks = await this.client.dbNew.getGuildLavalinks(req.guild!.id);
			if (!lavalinks?.length) {
				response.error(res, 404, `No lavalink nodes found for guild id: ${req.guild!.id}`);
				return;
			}

			const formattedLavalinks = lavalinks.map(({ NodeAuthorization, ...rest }) => rest);
			response.success(res, { lavalinks: formattedLavalinks });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public getGuildLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		const { nodeId } = req.params;
		const guildId = req.guild!.id;

		const officialLavalink = await this.client.dbNew.getOfficialLavalink(nodeId);
		const guildLavalink = await this.client.dbNew.getGuildLavalink(guildId, nodeId);
		const lavalink = officialLavalink || guildLavalink;
		if (!lavalink) {
			response.error(res, 404, `Lavalink node ${nodeId} not found`);
			return;
		}

		const formattedLavalink = { ...lavalink, NodeAuthorization: undefined };
		response.success(res, { lavalink: formattedLavalink });
	};

	public createGuildLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			nodeName: z.string().min(1),
			nodeHost: z.string().min(1),
			nodePort: z.coerce.number().int().positive(),
			nodeAuthorization: z.string().min(1),
			nodeSecure: z.coerce.boolean().default(false),
			nodeRetryAmount: z.coerce.number().int().nonnegative().default(0),
			nodeRetryDelay: z.coerce.number().int().nonnegative().default(0)
		});

		try {
			const lavalinkData = schema.parse(req.body ?? {});
			const nodeId = nanoid(11);

			// Test connection before creating
			const customNodeOptions: LavalinkNodeOptions = {
				id: `${req.guild!.id}-${nodeId}`,
				host: lavalinkData.nodeHost,
				port: lavalinkData.nodePort,
				authorization: lavalinkData.nodeAuthorization,
				secure: lavalinkData.nodeSecure,
				retryAmount: lavalinkData.nodeRetryAmount,
				retryDelay: lavalinkData.nodeRetryDelay
			};

			const result = await testConnection(customNodeOptions, this.client.manager.nodeManager);
			if (result.status_code === 'failed') {
				response.error(res, 503, `Failed to connect to ${lavalinkData.nodeName}: ${result.reason}`);
				return;
			}

			await this.client.dbNew.createGuildLavalink(req.guild!.id, {
				NodeId: nodeId,
				NodeName: lavalinkData.nodeName,
				NodeHost: lavalinkData.nodeHost,
				NodePort: lavalinkData.nodePort,
				NodeAuthorization: lavalinkData.nodeAuthorization,
				NodeSecure: lavalinkData.nodeSecure,
				NodeRetryAmount: lavalinkData.nodeRetryAmount,
				NodeRetryDelay: lavalinkData.nodeRetryDelay
			});

			response.success(res, {
				message: `Lavalink node ${lavalinkData.nodeName} has been created`
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public deleteGuildLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { nodeId } = req.params;

			const lavalink = await this.client.dbNew.getGuildLavalink(req.guild!.id, nodeId);
			if (!lavalink) {
				response.error(res, 404, `Lavalink node ${nodeId} not found`);
				return;
			}

			await this.client.dbNew.deleteGuildLavalink(req.guild!.id, lavalink.id);

			response.success(res, {
				message: 'Lavalink node has been deleted'
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public testGuildLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const { nodeId } = req.params;
			const guildId = req.guild!.id;

			const officialLavalink = await this.client.dbNew.getOfficialLavalink(nodeId);
			const guildLavalink = await this.client.dbNew.getGuildLavalink(guildId, nodeId);
			const lavalink = officialLavalink || guildLavalink;
			if (!lavalink) {
				response.error(res, 404, `Lavalink node ${nodeId} not found`);
				return;
			}

			const customNodeOptions: LavalinkNodeOptions = {
				id: `${guildId}-${nodeId}`,
				host: lavalink.NodeHost,
				port: lavalink.NodePort,
				authorization: lavalink.NodeAuthorization,
				secure: lavalink.NodeSecure,
				retryAmount: lavalink.NodeRetryAmount,
				retryDelay: lavalink.NodeRetryDelay
			};

			const result = await testConnection(customNodeOptions, this.client.manager.nodeManager);

			if (result.status_code === 'failed') {
				response.error(res, 503, `Failed to connect to ${lavalink.NodeName}: ${result.reason}`);
				return;
			}

			response.success(res, {
				status_code: 'success',
				message: `Connected to ${lavalink.NodeName}`,
				info: result.info,
				stats: result.stats
			});
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};
}

export default LavalinkController;
