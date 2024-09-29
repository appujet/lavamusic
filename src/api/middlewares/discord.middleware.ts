import type { Request, Response, NextFunction } from 'express';
import { response } from '../base';

class DiscordMiddleware {
	public isAccessTokenProvided = (req: Request, res: Response, next: NextFunction): void => {
		const accessToken = req.headers.authorization;

		if (!accessToken) {
			response.error(res, 401, 'Should contain Authorization Header');
			return;
		}

		next();
	};
}

export default DiscordMiddleware;
