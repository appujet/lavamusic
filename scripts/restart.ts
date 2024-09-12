import { exec } from "node:child_process";

async function startLavamusic(): Promise<void> {
    exec("npm start", (error, stderr) => {
        if (error) {
            console.error(`Error starting Lavamusic: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
        }
    });
}

setTimeout(startLavamusic, 5000);
