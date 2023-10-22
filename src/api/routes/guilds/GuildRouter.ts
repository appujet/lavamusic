/* eslint-disable @typescript-eslint/unbound-method */
import { Request, Response, Router } from 'express';

import ServerData from '../../../database/server';
import { IsAuth } from '../../middlewares/Middlewares';
import { getGuild, getGuildMembers } from '../../services/guilds/GuildServices';

class GuildRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.get('/:id', IsAuth, this.getGuild);
        this.router.get('/:id/members', IsAuth, this.getGuildsMembers);
        this.router.put('/:id/prefix', IsAuth, this.updateGuildPrefix);
    }
    private async getGuild(req: Request, res: Response): Promise<Response> {
        const guild = await getGuild(req.params.id);
        return res.send(guild);
    }
    private async getGuildsMembers(req: Request, res: Response): Promise<Response> {
        const guild = await getGuildMembers(req.params.id);
        return res.send(guild);
    }

    private async updateGuildPrefix(req: Request, res: Response): Promise<Response> {
        await ServerData.setPrefix(req.params.id, req.body.prefix);
        return res.sendStatus(200);
    }
}

const guildRouter = new GuildRouter();
export default guildRouter.router;
