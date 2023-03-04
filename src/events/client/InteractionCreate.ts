import { Event, Lavamusic, Context } from "../../structures/index.js";
import { CommandInteraction, InteractionType } from "discord.js";

export default class InteractionCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "interactionCreate",
        });
    }
    public async run(interaction: CommandInteraction): Promise<void> {

        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            const ctx = new Context(interaction, interaction.options.data);
            ctx.setArgs(interaction.options.data as any);
            try {
                await command.run(this.client, ctx, ctx.args);
            } catch (error) {
                this.client.logger.error(error);
                await interaction.reply({ content: `An error occured: \`${error}\`` })
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