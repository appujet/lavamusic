import { Request, Response, NextFunction } from 'express';

export const IsAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
