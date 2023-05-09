import config from "./config.js";
import { ShardingManager } from "discord.js";
import Logger from "./structures/Logger.js";
import * as fs from 'fs';
const logger = new Logger();
if (!fs.existsSync("./src/utils/LavaLogo.txt")) {
    logger.error("LavaLogo.txt file is missing");
    process.exit(1);
}
try {
    const logFile = fs.readFileSync("./src/utils/LavaLogo.txt", "utf-8");
    console.log('\x1b[35m%s\x1b[0m', logFile);
}
catch (err) {
    logger.error("[CLIENT] An error has occurred :", err);
}
const manager = new ShardingManager("./dist/LavaClient.js", {
    respawn: true,
    token: config.token,
    totalShards: "auto",
    shardList: "auto",
});
manager.spawn({ amount: manager.totalShards, delay: null, timeout: -1 }).then((shards) => {
    logger.start(`[CLIENT] ${shards.size} shard(s) spawned.`);
}).catch((err) => {
    logger.error("[CLIENT] An error has occurred :", err);
});
manager.on("shardCreate", (shard) => {
    shard.on("ready", () => {
        logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
    });
});
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
//# sourceMappingURL=index.js.map