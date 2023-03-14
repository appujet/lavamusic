export default class Command {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.nameLocalizations = options.nameLocalizations;
        this.description = {
            content: options.description
                ? options.description.content || "No description provided"
                : "No description provided",
            usage: options.description
                ? options.description.usage || "No usage provided"
                : "No usage provided",
            examples: options.description ? options.description.examples || [""] : [""],
        };
        this.descriptionLocalizations = options.descriptionLocalizations;
        this.aliases = options.aliases || [];
        this.cooldown = options.cooldown || 3;
        this.args = options.args || false;
        this.player = {
            voice: options.player ? options.player.voice || false : false,
            dj: options.player ? options.player.dj || false : false,
            active: options.player ? options.player.active || false : false,
            djPerm: options.player ? options.player.djPerm || null : null,
        };
        this.permissions = {
            dev: options.permissions ? options.permissions.dev || false : false,
            client: options.permissions
                ? options.permissions.client || []
                : ["SendMessages", "ViewChannel", "EmbedLinks"],
            user: options.permissions ? options.permissions.user || [] : [],
        };
        this.slashCommand = options.slashCommand || false;
        this.options = options.options || [];
        this.category = options.category || "general";
    }
    ;
    async run(client, message, args) {
        return Promise.resolve();
    }
    ;
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
//# sourceMappingURL=Command.js.map