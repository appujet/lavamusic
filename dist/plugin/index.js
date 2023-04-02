import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function loadPlugins(client) {
    const pluginsFolder = path.join(__dirname, './plugins');
    const pluginFiles = fs.readdirSync(pluginsFolder).filter((file) => file.endsWith('.js'));
    pluginFiles.forEach(async (file) => {
        const plugin = (await import(`./plugins/${file}`)).default;
        if (plugin.initialize)
            plugin.initialize(client);
        client.logger.info(`Loaded plugin: ${plugin.name} v${plugin.version}`);
    });
}
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