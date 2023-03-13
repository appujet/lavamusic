import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command, Lavamusic, Context } from "../../structures/index.js";
import { Song } from "../../structures/Dispatcher.js";


export default class Search extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "search",
            description: {
                content: "Searches for a song",
                examples: ["search", "search <song>"],
                usage: "search"
            },
            category: "music",
            aliases: ["search"],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: [
                {
                    name: "song",
                    description: "The song you want to search",
                    type: 3,
                    required: true
                }
            ]
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const embed = client.embed().setColor(client.color.main)
        let player = client.queue.get(ctx.guild.id);
        const query = args.join(" ");
        if (!player) {
            const vc = ctx.member as any;
            player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());
        };
        const res = await this.client.queue.search(query);
        if (!res) return ctx.sendMessage({ embeds: [embed.setDescription(`**No results found**`).setColor(client.color.red)] });
        let msg: any;
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("1")
                    .setLabel("1")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("2")
                    .setLabel("2")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("3")
                    .setLabel("3")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("4")
                    .setLabel("4")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("5")
                    .setLabel("5")
                    .setStyle(ButtonStyle.Primary),
            );
        switch (res.loadType) {
            case 'LOAD_FAILED':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription('There was an error while searching.')] });
                break;
            case 'NO_MATCHES':
                ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription('There were no results found.')] });
                break;
            case 'SEARCH_RESULT':
                const tracks = res.tracks.slice(0, 5);
                const embeds = tracks.map((track: Song, index: number) => `${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``);
                msg = await ctx.sendMessage({ embeds: [embed.setDescription(embeds.join("\n"))], components: [row] });
                break;
        };
        const collector = msg.createMessageComponentCollector({
            filter: (f: any) =>
                f.user.id === ctx.author.id ? true : false && f.deferUpdate(),
            max: 1,
            time: 60000,
            idle: 60000 / 2,
        });
        collector.on("collect", async (int: any) => {
            for (let i = 0; i < res.tracks.length; i++) {
                if (int.customId === `${i + 1}`) {
                    let track = res.tracks[i];
                    track = player.buildTrack(track, ctx.author);
                    player.queue.push(track);
                    player.isPlaying()
                    await ctx.editMessage({ embeds: [embed.setDescription(`Added [${track.info.title}](${track.info.uri}) to the queue`)], components: [] });
                };
            };
            return await int.deferUpdate();
        });

        collector.on("end", async () => {
            await ctx.editMessage({ components: [] });
        });
    };
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