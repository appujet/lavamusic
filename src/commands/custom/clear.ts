import { Command, type Context, type Lavamusic } from "../../structures/index.js";
import { PermissionsBitField, TextChannel, NewsChannel, GuildMember, DiscordAPIError } from "discord.js";

export default class Clear extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "clear",
            description: {
                content: "Clears messages in the current channel. Messages older than 14 days are not deleted.",
                usage: "clear",
                examples: ["clear"],
            },
            category: "moderation",
            aliases: ["purge"],
            cooldown: 10,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["ManageMessages", "ReadMessageHistory"],
                user: ["ManageMessages"],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const member = ctx.member as GuildMember | null;

        if (!member || !member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return ctx.sendMessage("You do not have permission to use this command.");
        }

        if (!ctx.channel || !(ctx.channel instanceof TextChannel || ctx.channel instanceof NewsChannel)) {
            return ctx.sendMessage("This command can only be used in text channels.");
        }

        const channel = ctx.channel as TextChannel | NewsChannel;

        try {
            let fetchedMessages;
            let lastMessageId: string | null = null;

            // Fetch and delete messages in chunks
            do {
                fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
                lastMessageId = fetchedMessages.last()?.id || null;
                await channel.bulkDelete(fetchedMessages, true);
            } while (fetchedMessages.size >= 2);

            ctx.sendMessage("All messages have been cleared.");
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === 50034) {
                    ctx.sendMessage("You can only bulk delete messages that are under 14 days old.");
                } else {
                    console.error("Unexpected error clearing messages:", error);
                    ctx.sendMessage("There was an error clearing the messages. Please try again.");
                }
            } else {
                console.error("Unexpected error clearing messages:", error);
                ctx.sendMessage("There was an error clearing the messages. Please try again.");
            }
        }
    }
}
