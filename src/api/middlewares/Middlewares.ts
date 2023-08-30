import { Request, Response, NextFunction } from 'express';

export const IsAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log(`IsAuth: ${req.user}`);
    if (req.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
