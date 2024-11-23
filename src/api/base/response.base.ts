import type { Response } from 'express';

export const success = <T>(res: Response, data: T): Response => {
	return res.status(200).json({
		success: {
			code: 200,
			data,
		},
	});
};

export const error = (res: Response, code: number, message: string): Response => {
	return res.status(code).json({
		error: {
			code,
			message,
		},
	});
};
