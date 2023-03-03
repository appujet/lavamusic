import { Command, Lavamusic, Context} from "../../structures/index.js";


export default class Ping extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "ping",
            description: {
                content: "Shows the bot's ping",
                examples: ["ping"],
                usage: "ping"
            },
            category: "general",
            aliases: ["pong"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: []
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
        return await ctx.sendMessage(`Pong! \`${client.ws.ping}ms\``)
    }
};


/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */