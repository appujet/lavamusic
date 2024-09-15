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
