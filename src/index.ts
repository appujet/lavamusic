// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as fs from "node:fs";
import { ShardingManager } from "discord.js";

import config from "./config.js";
import Logger from "./structures/Logger.js";

const logger = new Logger();

class ThemeSelector {
    /**
     * Applies a yellow fire effect to the text.
     *
     * @param text - The input text to apply the effect to.
     * @returns The processed text with the green fire effect.
     */
    fire(text: string): string {
        let fade = "";
        let green = 250;

        for (const line of text.split("\n")) {
            fade += `\x1b[38;2;255;${green};0m${line}\x1b[0m\n`;
            green = Math.max(0, green - 25);
        }

        return fade;
    }

    /**
     * Applies a purple neon effect to the text.
     *
     * @param text - The input text to apply the effect to.
     * @returns The processed text with the purple neon effect.
     */
    purpleNeon(text: string): string {
        let fade = "";
        let purple = 255;

        for (const line of text.split("\n")) {
            fade += `\x1b[38;2;255;0;${purple}m${line}\x1b[0m\n`;
            purple = Math.max(0, purple - 25);
        }

        return fade;
    }

    /**
     * Applies a cyan effect to the text.
     *
     * @param text - The input text to apply the effect to.
     * @returns The processed text with the cyan effect.
     */
    cyan(text: string): string {
        let fade = "";
        let blue = 100;

        for (const line of text.split("\n")) {
            fade += `\x1b[38;2;0;255;${blue}m${line}\x1b[0m\n`;
            if (blue < 255) {
                blue = Math.min(255, blue + 15);
            }
        }

        return fade;
    }

    /**
     * Applies a water effect to the text.
     *
     * @param text - The input text to apply the effect to.
     * @returns The processed text with the water effect.
     */
    water(text: string): string {
        let fade = "";
        let green = 255;

        for (const line of text.split("\n")) {
            fade += `\x1b[38;2;0;${green};255m${line}\x1b[0m\n`;
            if (green > 30) {
                green = Math.max(30, green - 40);
            }
        }

        return fade;
    }
}

const theme = new ThemeSelector();

/**
 * Sets the console window title.
 * @param title - The new title for the console window.
 */
function setConsoleTitle(title: string): void {
    // Write the escape sequence to change the console title
    process.stdout.write(`\x1b]0;${title}\x07`);
}

async function main(): Promise<void> {
    try {
        if (!fs.existsSync("./src/utils/LavaLogo.txt")) {
            logger.error("LavaLogo.txt file is missing");
            process.exit(1);
        }
        console.clear();
        // Set a custom title for the console window
        setConsoleTitle("Lavamusic");
        const logFile = fs.readFileSync("./src/utils/LavaLogo.txt", "utf-8");
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(theme.purpleNeon(logFile));
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
