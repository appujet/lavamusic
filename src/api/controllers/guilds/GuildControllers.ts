import { Request, Response } from "express";
import { getBotGuildsService, getUserGuildsService } from "../../services/guilds/GuildServices";


export async function getGuildController(req: Request, res: Response) {
    try {
        const user = req.user as any;
        const data = await getBotGuildsService();
        const userGuilds = getUserGuildsService(user.id);
        res.send({ data, userGuilds });
    } catch (error) {
        console.log(error);
        res.sendStatus(400).send({ error: "Bad Request" });
    }
}