import { Command, type Context, type Lavamusic } from "../../structures/index.js";

/* "help": {
            "description": "Shows the help menu.",
            "options": {
                "command": "The command you want to get info on"
            },
            "content": "Hey there! I'm {bot}, a music bot made with [Lavamusic](https://github.com/appujet/lavamusic) and Discord. You can use `{prefix}help <command>` to get more info on a command.",
            "title": "Help Menu",
            "help_cmd": "**Description:** {description.content}\n**Usage:** {usage}\n**Examples:** {examples}\n**Aliases:** {aliases}\n**Category:** {category}\n**Cooldown:** {cooldown} seconds\n**Permissions:** {premUser}\n**Bot Permissions:** {premBot}\n**Developer Only:** {dev}\n**Slash Command:** {slash}\n**Args:** {args}\n**Player:** {player}\n**DJ:** {dj}\n**DJ Permissions:** {djPerm}\n**Voice:** {voice}",
            "footer": "Use {prefix}help <command> for more info on a command"
        } */
export default class Help extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "help",
            description: {
                content: "cmd.help.description",
                examples: ["help"],
                usage: "help",
            },
            category: "info",
            aliases: ["h"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "command",
                    description: "cmd.help.options.command",
                    type: 3,
                    required: false,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed();
        const guild = await client.db.get(ctx.guild.id);
        const commands = this.client.commands.filter((cmd) => cmd.category !== "dev");
        const categories = [...new Set(commands.map((cmd) => cmd.category))];
        if (args[0]) {
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command) {
                return await ctx.sendMessage({
                    embeds: [client.embed().setColor(client.color.red).setDescription(ctx.locale("cmd.help.not_found", { cmdName: args[0] }))],
                });
            }
            const helpEmbed = embed
                .setColor(client.color.main)
                .setTitle(`${ctx.locale("cmd.help.title")} - ${command.name}`)
                .setDescription(
                    ctx.locale("cmd.help.help_cmd", {
                        description: command.description.content,
                        usage: `${guild.prefix}${command.description.usage}`,
                        examples: command.description.examples.map((example) => `${guild.prefix}${example}`).join(", "),
                        aliases: command.aliases.map((alias) => `\`${alias}\``).join(", "),
                        category: command.category,
                        cooldown: command.cooldown,
                        premUser:
                            command.permissions.user.length > 0 ? command.permissions.user.map((perm) => `\`${perm}\``).join(", ") : "None",
                        premBot: command.permissions.client.map((perm) => `\`${perm}\``).join(", "),
                        dev: command.permissions.dev ? "Yes" : "No",
                        slash: command.slashCommand ? "Yes" : "No",
                        args: command.args ? "Yes" : "No",
                        player: command.player.active ? "Yes" : "No",
                        dj: command.player.dj ? "Yes" : "No",
                        djPerm: command.player.djPerm ? command.player.djPerm : "None",
                        voice: command.player.voice ? "Yes" : "No",
                    }),
                );
            return await ctx.sendMessage({ embeds: [helpEmbed] });
        }
        const fields = categories.map((category) => ({
            name: category,
            value: commands
                .filter((cmd) => cmd.category === category)
                .map((cmd) => `\`${cmd.name}\``)
                .join(", "),
            inline: false,
        }));
        const helpEmbed = embed
            .setColor(client.color.main)
            .setTitle(ctx.locale("cmd.help.title"))
            .setDescription(
                ctx.locale("cmd.help.content", {
                    bot: client.user.username,
                    prefix: guild.prefix,
                }),
            )
            .setFooter({
                text: ctx.locale("cmd.help.footer", { prefix: guild.prefix }),
            });
        helpEmbed.addFields(...fields);
        return await ctx.sendMessage({ embeds: [helpEmbed] });
    }
}

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
