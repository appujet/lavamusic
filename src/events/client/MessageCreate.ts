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
      
        if (!message.content.startsWith(this.client.config.PREFIX)) return;
        const args = message.content.slice(this.client.config.PREFIX.length).trim().split(/ +/g);
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
}