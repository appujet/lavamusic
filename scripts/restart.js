import { exec } from "node:child_process";

function startLavamusic() {
    exec("npm start", (error, _stdout, stderr) => {
        if (error) {
            console.error(`Error starting Lavamusic: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
    });
}

setTimeout(startLavamusic, 5000);
