import { Router, Request, Response } from "express";
import { IsAuth } from "../../middlewares/Middlewares";
import { getGuild, getGuildMembers } from "../../services/guilds/GuildServices";


class GuildRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/:id", IsAuth, this.getGuild);
        this.router.get("/:id/members", IsAuth, this.getGuildsMembers);
    }
    private async getGuild(req: Request, res: Response) {
        const guild = await getGuild(req.params.id);
        return res.send(guild);
    }
    private async getGuildsMembers(req: Request, res: Response) {
        const guild = await getGuildMembers(req.params.id);
        return res.send(guild);
    }
}

const guildRouter = new GuildRouter();
export default guildRouter.router;