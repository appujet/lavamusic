import { Command } from "../../structures/index.js";
export default class Leave extends Command {
    constructor(client) {
        super(client, {
            name: "leave",
            description: {
                content: "Leaves the voice channel",
                examples: ["leave"],
                usage: "leave"
            },
            category: "music",
            aliases: ["dc"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
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
    }
    ;
    async run(client, ctx, args) {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Left <#${player.player.connection.channelId}>`)] });
        player.destroy();
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
//# sourceMappingURL=Leave.js.map