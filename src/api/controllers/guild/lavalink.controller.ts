import type { Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import type { GuildRequest } from '@/api/middlewares/guild.middleware';
import { nanoid } from 'nanoid';
import { z } from 'zod';

class LavalinkController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public officialLavalinks = async (_req: GuildRequest, res: Response): Promise<void> => {
		try {
			const lavalinks = await this.client.dbNew.getOfficialLavalink();
			if (!lavalinks?.length) {
				response.error(res, 404, 'No official lavalink nodes found');
				return;
			}

			response.success(res, { lavalinks });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public guildLavalinks = async (req: GuildRequest, res: Response): Promise<void> => {
		try {
			const lavalinks = await this.client.dbNew.getGuildLavalinks(req.guild!.id);
			if (!lavalinks?.length) {
				response.error(res, 404, `No lavalink nodes found for guild id: ${req.guild!.id}`);
				return;
			}

			response.success(res, { lavalinks });
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
		}
	};

	public createGuildLavalink = async (req: GuildRequest, res: Response): Promise<void> => {
		const schema = z.object({
			nodeName: z.string().min(1),
			nodeHost: z.string().min(1),
			nodePort: z.coerce.number().int().positive(),
			nodeAuthorization: z.string().default(''),
			nodeSecure: z.boolean().default(false),
			nodeRetryAmount: z.coerce.number().int().nonnegative().default(5),
			nodeRetryDelay: z.coerce.number().int().positive().default(60000)
		});

		try {
			const lavalinkData = schema.parse(req.body ?? {});
			await this.client.dbNew.createGuildLavalink(req.guild!.id, {
				NodeId: nanoid(11),
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
}

export default LavalinkController; 