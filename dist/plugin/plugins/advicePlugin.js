const advicePlugin = {
    name: 'Advice Plugin',
    version: '1.0.0',
    author: 'Blacky',
    initialize: (client) => {
        const adviceList = [
            'Take a break and relax for a bit.',
            'Don\'t be afraid to ask for help.',
            'Try to focus on one task at a time.',
            'Take care of yourself before you take care of others.',
            'Don\'t be too hard on yourself.'
        ];
        client.on('message', (message) => {
            if (message.content.startsWith('!advice')) {
                const randomIndex = Math.floor(Math.random() * adviceList.length);
                const advice = adviceList[randomIndex];
                message.reply(advice);
            }
        });
    }
};
export default advicePlugin;
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
//# sourceMappingURL=advicePlugin.js.map