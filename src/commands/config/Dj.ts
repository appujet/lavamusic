import { Command, Lavamusic, Context } from "../../structures/index.js";
import { ApplicationCommandOptionType } from "discord.js";


export default class Dj extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "dj",
            description: {
                content: "Shows the bot's prefix",
                examples: ["dj add @role", "dj remove @role", "dj clear", "dj toggle"],
                usage: "dj"
            },
            category: "general",
            aliases: ["dj"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ['ManageGuild']
            },
            slashCommand: true,
            options: [
                {
                    name: "add",
                    description: "The dj role you want to add",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "The dj role you want to add",
                            type: ApplicationCommandOptionType.Role,
                            required: true
                        }
                    ],
                },
                {
                    name: "remove",
                    description: "The dj role you want to remove",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "The dj role you want to remove",
                            type: ApplicationCommandOptionType.Role,
                            required: true
                        }
                    ]
                },
                {
                    name: "clear",
                    description: "Clears all dj roles",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "toggle",
                    description: "Toggles the dj role",
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        let subCommand: string | any;
        let role: any;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            role = ctx.interaction.options.data[0].options[0].value;
        } else {
            subCommand = args[0];
            role = ctx.message.mentions.roles.first() || ctx.guild.roles.cache.get(args[1])
        }

        const embed = client.embed().setColor(client.color.main)

        let djrole = await this.client.prisma.guild.findUnique({
            where: {
                guildId: ctx.guild?.id
            },
            include: {
                dj: true
            }
        });
        let roleId: any;
        if (role) ctx.guild.roles.cache.get(role.id) ? roleId = role.id : roleId = role.id;
        if (subCommand === "add") {
            if (!role) {
                return await ctx.sendMessage({ embeds: [embed.setDescription("Please provide a role")] })
            }
            if (!djrole) {
                const guildId = ctx.guild?.id;
                if (guildId) {
                    await this.client.prisma.guild.create({
                        data: {
                            guildId: guildId,
                            dj: {
                                create: {
                                    mode: true,
                                    roles: {
                                        create: [
                                            {
                                                role: roleId
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    });
                    return await ctx.sendMessage({ embeds: [embed.setDescription(`Added ${roleId} to the dj roles`)] })
                }
            } else {
                const roleExists = await this.client.prisma.roles.findUnique({
                    where: {
                        role: roleId,
                    }
                });
                if (roleExists) {
                    return await ctx.sendMessage({ embeds: [embed.setDescription(`${roleId} is already a dj role`)] })
                }
                const guildId = ctx.guild?.id;
                if (guildId) {
                    await this.client.prisma.guild.update({
                        where: {
                            guildId: guildId
                        },
                        data: {
                            dj: {
                                update: {
                                    roles: {
                                        create: [
                                            {
                                                role: roleId
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    })
                    return await ctx.sendMessage({ embeds: [embed.setDescription(`Added ${roleId} to the dj roles`)] })
                }
            }
        } else if (subCommand === "remove") {
            if (!role) {
                return await ctx.sendMessage({ embeds: [embed.setDescription("Please provide a role")] })
            }
            if (!djrole) {
                return await ctx.sendMessage({ embeds: [embed.setDescription(`${roleId} is not a dj role`)] })
            }
            const roleExists = await this.client.prisma.roles.findUnique({
                where: {
                    role: roleId,
                }
            });
            if (!roleExists) {
                return await ctx.sendMessage({ embeds: [embed.setDescription(`${roleId} is not a dj role`)] })
            }
            const guildId = ctx.guild?.id;
            if (guildId) {
                await this.client.prisma.guild.update({
                    where: {
                        guildId: guildId
                    },
                    data: {
                        dj: {
                            update: {
                                roles: {
                                    delete: {
                                        role: roleId
                                    }
                                }
                            }
                        }
                    }
                })
                return await ctx.sendMessage({ embeds: [embed.setDescription(`Removed ${roleId} from the dj roles`)] })
            }
        } else if (subCommand === "clear") {
            if (!djrole) {
                return await ctx.sendMessage({ embeds: [embed.setDescription("There are no dj roles")] })
            }
            const guildId = ctx.guild?.id;
            if (guildId) {
                await this.client.prisma.guild.update({
                    where: {
                        guildId: guildId,
                    },
                    data: {
                        dj: {
                            delete: true
                        }
                    }
                })
                return await ctx.sendMessage({ embeds: [embed.setDescription("Cleared all dj roles")] })
            }
        } else if (subCommand === "toggle") {
            if (!djrole) {
                return await ctx.sendMessage({ embeds: [embed.setDescription("There are no dj roles")] })
            }
            const guildId = ctx.guild?.id;
            if (guildId) {
                await this.client.prisma.guild.update({
                    where: {
                        guildId: guildId,
                    },
                    data: {
                        dj: {
                            update: {
                                mode: !djrole.dj.mode
                            }
                        }
                    }
                })
                return await ctx.sendMessage({ embeds: [embed.setDescription(`Toggled dj mode to \`${djrole.dj.mode}\``)] })
            }
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