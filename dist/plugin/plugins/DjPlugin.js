import { Events } from 'discord.js';
const DjPlugin = {
    name: 'Dj Plugin',
    version: '1.0.0',
    author: 'Blacky',
    description: 'This plugin manage the dj role',
    initialize: (client) => {
        client.on(Events.MessageCreate, async (message) => {
            const commands = client.commands;
        });
    }
};
export default DjPlugin;
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
//# sourceMappingURL=DjPlugin.js.map