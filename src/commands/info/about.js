import Command from "../../structures/Command.js"; 
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            description: {
                content: 'See information about this project.',
                usage: 'about',
                examples: ['about'],
            },
            aliases: ["abouts"],
            category: 'general',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            slashCommand: true,
        });
    }

    async run(ctx, args) {

        const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel("Invite MOE")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://moebot.xyz/invite`),
        new ButtonBuilder()
        .setLabel("Support MOE")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/6zpF9BCmSR"))

        const embed = this.client.embed()
            .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png'})
            .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setColor(this.client.color.default)
            .addFields([
                { name: 'Creator', value: '[Blacky#9125](https://github.com/brblacky)', inline: true },
                { name: 'Repository', value: '[Here](https://github.com/brblacky/lavamusic)', inline: true },
                { name: 'Support', value: '[Here](https://discord.gg/ns8CTk9J3e)', inline: true },
                { name: '\u200b', value: `He really wanted to make his first open source project ever for more coding experience. In this project, he was challenged to make a project with less bugs. Hope you enjoy using LavaMusic!`, inline: true },
            ]);
        return await ctx.sendMessage({ content: '', embeds: [embed], components: [row]})
    }
}
