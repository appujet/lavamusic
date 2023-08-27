import { Request, Response, NextFunction } from 'express';

export const IsAuth = (req: Request, res: Response, next: NextFunction) => req.user ? next() : res.sendStatus(401).send({ error: 'Unauthorized' });