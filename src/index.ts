// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as fs from "node:fs";
import { ShardingManager } from "discord.js";

import config from "./config.js";
import Logger from "./structures/Logger.js";

const logger = new Logger();

async function main(): Promise<void> {
    try {
        if (!fs.existsSync("./src/utils/LavaLogo.txt")) {
            logger.error("LavaLogo.txt file is missing");
            process.exit(1);
        }

        const logFile = fs.readFileSync("./src/utils/LavaLogo.txt", "utf-8");
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("\x1b[35m%s\x1b[0m", logFile);

        const manager = new ShardingManager("./dist/LavaClient.js", {
            respawn: true,
            token: config.token,
            totalShards: "auto",
            shardList: "auto",
        });

        manager.on("shardCreate", (shard) => {
            shard.on("ready", () => {
                logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
            });
        });

        await manager.spawn();

        logger.start(`[CLIENT] ${manager.totalShards} shard(s) spawned.`);
    } catch (err) {
        logger.error("[CLIENT] An error has occurred:", err);
    }
}

main();

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
