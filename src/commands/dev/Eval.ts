import { Command, Lavamusic, Context } from '../../structures/index.js';

export default class Eval extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'eval',
            description: {
                content: "Evaluate code",
                examples: ['eval'],
                usage: 'eval',
            },
            category: 'dev',
            aliases: ['ev'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
        const code = args.join(' ');
        try {
            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = ((await import('util')).inspect(evaled));
            ctx.sendMessage(`\`\`\`js\n${evaled}\n\`\`\``);
        } catch (e) {
            ctx.sendMessage(`\`\`\`js\n${e}\n\`\`\``);
        }
    }
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