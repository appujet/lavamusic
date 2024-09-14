const { exec } = require("node:child_process");

async function startLavamusic() {
    exec("npm start", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting Lavamusic: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error starting Lavamusic: ${stderr}`);
        }
    });
}

setTimeout(startLavamusic, 5000);
