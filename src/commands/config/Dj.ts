import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Dj extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "dj",
            description: {
                content: "Manage the DJ mode and associated roles",
                examples: ["dj add @role", "dj remove @role", "dj clear", "dj toggle"],
                usage: "dj",
            },
            category: "general",
            aliases: ["dj"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "add",
                    description: "The DJ role you want to add",
                    type: 1,
                    options: [
                        {
                            name: "role",
                            description: "The DJ role you want to add",
                            type: 8,
                            required: true,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "The DJ role you want to remove",
                    type: 1,
                    options: [
                        {
                            name: "role",
                            description: "The DJ role you want to remove",
                            type: 8,
                            required: true,
                        },
                    ],
                },
                {
                    name: "clear",
                    description: "Clears all DJ roles",
                    type: 1,
                },
                {
                    name: "toggle",
                    description: "Toggles the DJ role",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = this.client.embed().setColor(this.client.color.main);
        const dj = await client.db.getDj(ctx.guild.id);
        let subCommand: string;
        let role: any;

        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            if (subCommand === "add" || subCommand === "remove") {
                role = ctx.interaction.options.data[0].options[0].role;
            }
        } else {
            subCommand = args[0];
            role = ctx.message.mentions.roles.first() || ctx.guild.roles.cache.get(args[1]);
        }

        switch (subCommand) {
            case "add":
                if (!role) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription("Please provide a role to add.")],
                    });
                }
                if (await client.db.getRoles(ctx.guild.id).then((r) => r.some((re) => re.roleId === role.id))) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription(`The DJ role <@&${role.id}> is already added.`)],
                    });
                }
                await client.db.addRole(ctx.guild.id, role.id);
                await client.db.setDj(ctx.guild.id, true);
                return ctx.sendMessage({
                    embeds: [embed.setDescription(`The DJ role <@&${role.id}> has been added.`)],
                });

            case "remove":
                if (!role) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription("Please provide a role to remove.")],
                    });
                }
                if (!(await client.db.getRoles(ctx.guild.id).then((r) => r.some((re) => re.roleId === role.id)))) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription(`The DJ role <@&${role.id}> is not added.`)],
                    });
                }
                await client.db.removeRole(ctx.guild.id, role.id);
                return ctx.sendMessage({
                    embeds: [embed.setDescription(`The DJ role <@&${role.id}> has been removed.`)],
                });

            case "clear":
                if (!dj) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription("The DJ role is already empty.")],
                    });
                }
                await client.db.clearRoles(ctx.guild.id);
                return ctx.sendMessage({
                    embeds: [embed.setDescription("All DJ roles have been removed.")],
                });

            case "toggle":
                if (!dj) {
                    return ctx.sendMessage({
                        embeds: [embed.setDescription("The DJ role is empty.")],
                    });
                }
                await client.db.setDj(ctx.guild.id, !dj.mode);
                return ctx.sendMessage({
                    embeds: [embed.setDescription(`The DJ mode has been toggled to ${dj.mode ? "disabled." : "enabled."}`)],
                });

            default:
                return ctx.sendMessage({
                    embeds: [
                        embed
                            .setDescription("Please provide a valid subcommand.")
                            .addFields({ name: "Subcommands", value: "`add`, `remove`, `clear`, `toggle`" }),
                    ],
                });
        }
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
