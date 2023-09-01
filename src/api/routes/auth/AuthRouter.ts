import { Router, Request, Response } from "express";
import passport from "passport";
import config from "../../../config";

class AuthRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/", this.getHello);
        this.router.get("/login", passport.authenticate("discord"), (req, res) => {
            res.sendStatus(200);
        });
        this.router.get("/logout", (req, res, next) => {
            req.logout(function (err) {
                if (err) { return next(err); }
                res.redirect(`${config.dashboard.website}/`);
            });
        });
        this.router.get("/redirect", passport.authenticate("discord"), (req, res) => {
            res.redirect(`${config.dashboard.website}/dashboard`);
        });
        this.router.get("/me", this.getLogin);
    }

    private getHello(req: Request, res: Response) {
        res.json({ message: "lavamusic api v1 made by devblacky" });
    }

    private async getLogin(req: Request, res: Response) {
        return req.user ? res.send(req.user) : res.sendStatus(401).send({ error: "Unauthorized" });
    }
}

const authRouter = new AuthRouter();
export default authRouter.router;