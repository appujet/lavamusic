// biome-ignore lint/correctness/noNodejsModules: <explanation>
import { existsSync } from "node:fs";
// biome-ignore lint/correctness/noNodejsModules: <explanation>
import { rm } from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: <explanation>
import { resolve } from "node:path";

async function clean() {
    try {
        const path = resolve("dist");
        if (existsSync(path)) {
            await rm(path, { recursive: true, force: true });
        }
    } catch (error) {
        console.error("Error while cleaning dist folder:", error);
        process.exit(1);
    }
}

clean();
