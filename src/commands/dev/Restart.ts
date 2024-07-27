import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { exec } from "child_process";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Restart extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "restart",
            description: {
                content: "Restart the bot",
                examples: ["restart"],
                usage: "restart",
            },
            category: "dev",
            aliases: ["reboot"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {

        const embed = this.client.embed();

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Confirm Restart")
            .setCustomId("confirm-restart");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        const restartembed = embed
        .setColor(client.color.red)
        .setDescription(`**Are you sure you want to restart the **\`${client.user.username}\`?`)
        .setTimestamp();
    
        const msg = await ctx.sendMessage({
            embeds: [restartembed],
            components: [row],
        });

        const filter = (i: any) => i.customId === "confirm-restart" && i.user.id === ctx.author.id;
        const collector = msg.createMessageComponentCollector({ time: 30000, filter });

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            await msg.edit({
                content: "Restarting the bot...",
                components: [],
            });
            await client.destroy();
            exec("node scripts/restart.ts");
            process.exit(0);
        });

        collector.on("end", async () => {
            if (!collector.ended) {
                await msg.edit({
                    content: "Restart cancelled.",
                    components: [],
                });
            }
        });
    }
}
