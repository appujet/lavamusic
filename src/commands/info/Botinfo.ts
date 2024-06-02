import os from "node:os";
import { version } from "discord.js";
import { showTotalMemory, usagePercent } from "node-system-stats";

import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Botinfo extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "botinfo",
            description: {
                content: "Information about the bot",
                examples: ["botinfo"],
                usage: "botinfo",
            },
            category: "info",
            aliases: ["info", "bi"],
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
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const osInfo = `${os.type()} ${os.release()}`;
        const osUptime = client.utils.formatTime(os.uptime());
        const osHostname = os.hostname();
        const cpuInfo = `${os.arch()} (${os.cpus().length} cores)`;
        const cpuUsed = (await usagePercent({ coreIndex: 0, sampleMs: 2000 })).percent;
        const memTotal = showTotalMemory(true);
        const memUsed = (process.memoryUsage().rss / 1024 ** 2).toFixed(2);
        const nodeVersion = process.version;
        const discordJsVersion = version;
        const guilds = client.guilds.cache.size;
        const channels = client.channels.cache.size;
        const users = client.users.cache.size;
        const commands = client.commands.size;

        const botInfo = `Bot Information:
- **Operating System**: ${osInfo}
- **Uptime**: ${osUptime}
- **Hostname**: ${osHostname}
- **CPU Architecture**: ${cpuInfo}
- **CPU Usage**: ${cpuUsed}%
- **Memory Usage**: ${memUsed}MB / ${memTotal}GB
- **Node Version**: ${nodeVersion}
- **Discord Version**: ${discordJsVersion}
- **Connected to** ${guilds} guilds, ${channels} channels, and ${users} users
- **Total Commands**: ${commands}`;

        const embed = this.client.embed();
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(botInfo)],
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
