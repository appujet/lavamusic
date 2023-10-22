import { NextFunction, Request, Response } from 'express';

export const IsAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
