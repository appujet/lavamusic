import { Request, Response } from 'express';

import { getMutualGuildsService } from '../../services/guilds/GuildServices';

export async function getGuildController(req: Request, res: Response): Promise<void> {
    try {
        const user = req.user as any;
        const data = await getMutualGuildsService(user.id);
        res.send({
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(400).send({ error: 'Bad Request' });
    }
}
