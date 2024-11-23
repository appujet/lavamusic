import type { Request, Response } from 'express';
import { response, zod } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import { z } from 'zod';
import { mapTracks } from '@/utils/track';

class MusicController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public home = (_req: Request, res: Response): void => {
		response.success(res, {
			message: 'Music Route -> Home',
		});
	};

	public search = async (req: Request, res: Response): Promise<void> => {
		const searchSchema = z.object({
			query: z.string().min(1, 'Query must not be empty'),
			source: z.enum(['youtube', 'ytsearch', 'youtube music', 'ytmsearch', 'soundcloud']).optional(),
		});

		try {
			const { query, source } = searchSchema.parse(req.query);
			const result = await this.client.manager.search(query, null, source);
			const mappedResult = mapTracks(result.tracks);
			response.success(res, { search: { tracks: mappedResult } });

		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, zod.formatZodError(error));
			} else {
				response.error(res, 500, `An unexpected error occurred: ${error}`);
			}
		}
	};

	public lyrics = async (_req: Request, res: Response): Promise<void> => {
		// const lyricsSchema = z.object({
		// 	query: z.string().min(1, 'Query must not be empty'),
		// });
		// try {
		// 	const { query } = lyricsSchema.parse(req.query);
		// 	const lyrics = await this.client.manager.lyrics(query);
		// 	return response.success(res, { lyrics });

		// } catch (error) {
		// 	if (error instanceof z.ZodError) {
		// 		return response.error(res, 400, error.errors[0].message);
		// 	}
		// 	return response.error(res, 500, `An unexpected error occurred: ${error}`);
		// }
		response.error(res, 500, 'This feature is under maintenance.');
	};
}

export default MusicController;