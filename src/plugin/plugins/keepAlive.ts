import http from "node:http";
import type { Lavamusic } from "../../structures/index.js";
import type { BotPlugin } from "../index.js";

const keepAlive: BotPlugin = {
    name: "KeepAlive Plugin",
    version: "1.0.0",
    author: "Appu",
    initialize: (client: Lavamusic) => {
        if (client.config.keepAlive) {
            const server = http.createServer((_req, res) => {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(`I'm alive! Currently serving ${client.guilds.cache.size} guilds.`);
            });
            server.listen(3000, () => {
                client.logger.info("Keep-Alive server is running on port 3000");
            });
        }
    },
};

export default keepAlive;

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
