import { Event, Lavamusic, Context } from "../../structures/index.js";
import { Message } from "discord.js";

export default class MessageCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "messageCreate",
        });
    }
    public async run(message: Message): Promise<void> {
        if (message.author.bot) return;
    
        let prefix = await this.client.prisma.guild.findUnique({
            where: {
                guildId: message.guildId
            }
        }) as any;
        if (!prefix) {
            prefix = this.client.config.prefix;
        } else {
            prefix = prefix.prefix;
        }

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const command = this.client.commands.get(cmd);
        if (!command) return;
        const ctx = new Context(message, args);
        ctx.setArgs(args);
        
        try {
            await command.run(this.client, ctx, ctx.args);
        } catch (error) {
            this.client.logger.error(error);
             await message.reply({ content: `An error occured: \`${error}\``})
        }
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