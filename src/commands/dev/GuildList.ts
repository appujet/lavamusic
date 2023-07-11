import { Command, Lavamusic, Context } from '../../structures/index.js';


export default class GuildList extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'guildlist',
            description: {
                content: "List all guilds the bot is in",
                examples: ['guildlist'],
                usage: 'guildlist',
            },
            category: 'dev',
            aliases: ['glt'],
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
        const guilds = this.client.guilds.cache.map((g, i) => `${g.name} (${g.id})`);

        let chunks = client.utils.chunk(guilds, 10) as any;
        if (chunks.length === 0) chunks = 1;
        const pages = [];
        for (let i = 0; i < chunks.length; i++) {
            const embed = this.client.embed()
                .setColor(this.client.color.main)
                .setDescription(chunks[i].join('\n'))
                .setFooter({ text: `Page ${i + 1} of ${chunks.length}` });
            pages.push(embed);
        }
        return client.utils.paginate(ctx, pages);
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