import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index';

export default class Invite extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'invite',
            description: {
                content: 'Sends the bot\'s invite link',
                examples: ['invite'],
                usage: 'invite',
            },
            category: 'info',
            aliases: ['inv'],
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
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const clientId = process.env.CLIENT_ID;
        if (!clientId) {
            console.error(
                'Client ID not found in environment variables, cannot generate invite link.'
            );
            return await ctx.sendMessage(
                'Sorry, my invite link is not available at this time. Please tell the bot developer to check their console.'
            );
        }

        const embed = this.client.embed();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`
                ),
            new ButtonBuilder()
                .setLabel('My Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/STXurwnZD5')
        );

        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(
                        `You can invite me by clicking the button below. Any bugs or outages? Join the support server!`
                    ),
            ],
            components: [row],
        });
    }
}
