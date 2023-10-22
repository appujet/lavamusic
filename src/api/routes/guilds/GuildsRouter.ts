import { Request, Response, Router } from 'express';

import { getGuildController } from '../../controllers/guilds/GuildControllers';
import { IsAuth } from '../../middlewares/Middlewares';

class GuildsRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get('/', IsAuth, getGuildController);
    }
}

const guildsRouter = new GuildsRouter();
export default guildsRouter.router;
