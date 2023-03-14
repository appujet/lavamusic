import { Command } from "../../structures/index.js";
export default class Autoplay extends Command {
    constructor(client) {
        super(client, {
            name: "autoplay",
            description: {
                content: "Toggles autoplay",
                examples: ["autoplay"],
                usage: "autoplay"
            },
            category: "music",
            aliases: ["ap"],
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
        const autoplay = player.autoplay;
        player.autoplay = !autoplay;
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Autoplay has been ${autoplay ? "disabled" : "enabled"}`)] });
    }
}
;
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
//# sourceMappingURL=Autoplay.js.map