import express, { Express, Request, Response, NextFunction } from 'express';
import passport from "passport";
import Logger from '../structures/Logger';
import config from '../config';
import cors from 'cors';
import session from 'express-session';
import DiscordPassportStrategy from './strategy/discord';
import MainRouter from './routes/MainRouter';
import mongoStore from 'connect-mongo';

export class DiscordDashboard {
    private app: Express;
    public logger: Logger = new Logger();
    public config = config;
    private readonly discordStrategy: DiscordPassportStrategy
    public routes: MainRouter;
    constructor() {
        this.discordStrategy = new DiscordPassportStrategy();
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.errorHandler.bind(this));
        this.app.use(cors({
            origin: config.dashboard.website,
            credentials: true
        }));
        this.app.use(session({
            secret: config.dashboard.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 24 * 7
            },
            store: mongoStore.create({
                mongoUrl: config.database,
                collectionName: 'sessions',
                dbName: 'lavamusic'
            })
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.createRoutes();
    }
    public get App() {
        return this.app;
    }
    public get Logger() {
        return this.logger;
    }
    public createRoutes() {
        this.routes = new MainRouter();
        this.app.use('/api', this.routes.router);
    }
    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        this.logger.error(err.stack);
        res.status(500).json({ error: err.message });
    }
    public async start() {
        try {
            this.app.listen(this.config.dashboard.port, () => {
                this.logger.info(`[API] listening on port ${this.config.dashboard.port}`);
            });
        } catch (err) {
            this.logger.error(err);
        }
    }
}