import express, { Router } from 'express';

import AuthRouter from './auth/AuthRouter';
import GuildRouter from './guilds/GuildRouter';
import GuildsRouter from './guilds/GuildsRouter';

export default class MainRouter {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.use('/auth', AuthRouter);
        this.router.use('/guilds', GuildsRouter);
        this.router.use('/guild', GuildRouter);
    }
}
