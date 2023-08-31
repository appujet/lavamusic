import { Router, Request, Response } from "express";
import { IsAuth } from "../../middlewares/Middlewares";
import { getGuild, getGuildMembers } from "../../services/guilds/GuildServices";
import ServerData from "../../../database/server";


class GuildRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/:id", IsAuth, this.getGuild);
        this.router.get("/:id/members", IsAuth, this.getGuildsMembers);
        this.router.post("/:id/prefix", IsAuth, this.updateGuildPrefix);
    }
    private async getGuild(req: Request, res: Response) {
        const guild = await getGuild(req.params.id);
        return res.send(guild);
    }
    private async getGuildsMembers(req: Request, res: Response) {
        const guild = await getGuildMembers(req.params.id);
        return res.send(guild);
    }

    private async updateGuildPrefix(req: Request, res: Response) {
        console.log(req.params.id, req.body.prefix);
        await ServerData.setPrefix(req.params.id, req.body.prefix);
        return res.sendStatus(200);
    }
}

const guildRouter = new GuildRouter();
export default guildRouter.router;