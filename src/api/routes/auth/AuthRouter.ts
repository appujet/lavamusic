import { Router, Request, Response } from "express";
import passport from "passport";

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
        this.router.get("/redirect", passport.authenticate("discord"), (req, res) => {
            res.sendStatus(200);
        });
        this.router.get("/me", this.getLogin);
    }

    private getHello(req: Request, res: Response) {
        res.json({ message: "Hello World" });
    }

    private async getLogin(req: Request, res: Response) {
        return req.user ? res.send(req.user) : res.sendStatus(401).send({ error: "Unauthorized" });
    }
}

const authRouter = new AuthRouter();
export default authRouter.router;