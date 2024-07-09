import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

async function clean() {
    try {
        const path = resolve("dist");
        if (existsSync(path)) {
            await rm(path, { recursive: true, force: true });
        }
    } catch (error) {
        process.exit(1);
    }
}

clean();
