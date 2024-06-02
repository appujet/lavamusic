// clen dist folder using fs
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";


async function clean() {
    console.log("Cleaning dist folder");
    try {
        const path = resolve("dist");
        if (existsSync(path)) {
            await rm(path, { recursive: true });
            console.log("Dist folder cleaned");
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

clean();