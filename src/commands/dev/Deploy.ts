import {
    ActionRowBuilder,
    ButtonBuilder,
    type ButtonInteraction,
    ButtonStyle,
    ComponentType,
} from "discord.js";
import {
    Command,
    type Context,
    type Lavamusic,
} from "../../structures/index.js";

export default class Deploy extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "deploy",
            description: {
                content: "Deploy commands",
                examples: ["deploy"],
                usage: "deploy",
            },
            category: "dev",
            aliases: ["deploy-commands"],
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
                client: [
                    "SendMessages",
                    "ReadMessageHistory",
                    "ViewChannel",
                    "EmbedLinks",
                ],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(
        client: Lavamusic,
        ctx: Context,
        _args: string[],
    ): Promise<any> {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("deploy-global")
                .setLabel("Global")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("deploy-guild")
                .setLabel("Guild")
                .setStyle(ButtonStyle.Secondary),
        );

        const msg = await ctx.sendMessage({
            content: "Where do you want to deploy the commands?",
            components: [row],
        });

        const filter = (interaction: ButtonInteraction<"cached">) => {
            if (interaction.user.id !== ctx.author.id) {
                interaction.reply({
                    content: "You can't interact with this message",
                    ephemeral: true,
                });
                return false;
            }
            return true;
        };

        const collector = ctx.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 30000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "deploy-global") {
                await client.deployCommands();
                await interaction.update({
                    content: "Commands deployed globally.",
                    components: [],
                });
            } else if (interaction.customId === "deploy-guild") {
                await client.deployCommands(interaction.guild.id);
                await interaction.update({
                    content: "Commands deployed in this guild.",
                    components: [],
                });
            }
        });

        collector.on("end", async () => {
            await msg.delete().catch(() => {});
        });
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
