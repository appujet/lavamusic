biome-ignore lint/correctness/noNodejsModules: <explanation>
import os from "node:os";
import { version } from "discord.js";
import { showTotalMemory, usagePercent } from "node-system-stats";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Botinfo extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "botinfo",
            description: {
                content: "cmd.botinfo.description",
                examples: ["botinfo"],
                usage: "botinfo",
            },
            category: "info",
            aliases: ["bi", "info", "stats", "status"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
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
        const commands = client.commands.size;

        const promises = [
            client.shard.broadcastEval((client) => client.guilds.cache.size),
            client.shard.broadcastEval((client) => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            client.shard.broadcastEval((client) => client.channels.cache.size),
        ];
        return Promise.all(promises).then(async (results) => {
            const guilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const users = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const channels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);

            const embed = this.client.embed()
                .setColor(this.client.color.main)
                .setTitle("Bot Information")
                .addFields(
                    { name: "OS Info", value: osInfo, inline: true },
                    { name: "OS Uptime", value: osUptime, inline: true },
                    { name: "Hostname", value: osHostname, inline: true },
                    { name: "CPU Info", value: cpuInfo, inline: true },
                    { name: "CPU Used", value: `${cpuUsed}%`, inline: true },
                    { name: "Memory Used", value: `${memUsed} MB`, inline: true },
                    { name: "Memory Total", value: `${memTotal} MB`, inline: true },
                    { name: "Node.js Version", value: nodeVersion, inline: true },
                    { name: "Discord.js Version", value: discordJsVersion, inline: true },
                    { name: "Guilds", value: guilds.toString(), inline: true },
                    { name: "Users", value: users.toString(), inline: true },
                    { name: "Channels", value: channels.toString(), inline: true },
                    { name: "Commands", value: commands.toString(), inline: true }
                );

            return await ctx.sendMessage({
                embeds: [embed],
            });
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
