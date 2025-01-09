import type { FastifyInstance } from "fastify";
import { GuildController } from "../controllers/guild.controller";
import { container } from "tsyringe";


export const guildRoutes = (fastify: FastifyInstance) => {
    const controller = container.resolve(GuildController);

    fastify.get("/user/@me/guilds", controller.userMeGuild.bind(controller));
    fastify.get("/:guildId/channels", controller.channels.bind(controller));
    fastify.get("/:guildId", controller.guild.bind(controller));
    fastify.get("/:guildId/top-tracks", controller.getTopPlayedTracksPast24Hours.bind(controller));
};

