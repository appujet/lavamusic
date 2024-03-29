import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Help extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'help',
            description: {
                content: 'Shows the help menu',
                examples: ['help'],
                usage: 'help',
            },
            category: 'info',
            aliases: ['h'],
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
            options: [
                {
                    name: 'command',
                    description: 'The command you want to get info on',
                    type: 3,
                    required: false,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed();
        const prefix = client.db.getPrefix(ctx.guild.id);
        const commands = this.client.commands.filter(cmd => cmd.category !== 'dev');
        const categories = commands
            .map(cmd => cmd.category)
            .filter((value, index, self) => self.indexOf(value) === index);

        if (!args[0]) {
            const fildes = [];
            categories.forEach(category => {
                fildes.push({
                    name: category,
                    value: commands
                        .filter(cmd => cmd.category === category)
                        .map(cmd => `\`${cmd.name}\``)
                        .join(', '),
                    inline: false,
                });
            });
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle('Help Menu')
                .setDescription(
                    `Hey there! I'm ${this.client.user.username}, a music bot made with [Lavamusic](https://github.com/appujet/lavamusic) and Discord. You can use \`${prefix}help <command>\` to get more info on a command.`
                )
                .setFooter({
                    text: `Use ${prefix.prefix}help <command> for more info on a command`,
                });
            fildes.forEach(field => helpEmbed.addFields(field));
            ctx.sendMessage({ embeds: [helpEmbed] });
        } else {
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command)
                return await ctx.sendMessage({
                    embeds: [
                        client
                            .embed()
                            .setColor(client.color.red)
                            .setDescription(`Command \`${args[0]}\` not found`),
                    ],
                });
            const embed = this.client.embed();
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle(`Help Menu - ${command.name}`).setDescription(`**Description:** ${
                command.description.content
            }
**Usage:** ${prefix.prefix}${command.description.usage}
**Examples:** ${command.description.examples.map(example => `${prefix.prefix}${example}`).join(', ')}
**Aliases:** ${command.aliases.map(alias => `\`${alias}\``).join(', ')}
**Category:** ${command.category}
**Cooldown:** ${command.cooldown} seconds
**Permissions:** ${
                command.permissions.user.length > 0
                    ? command.permissions.user.map(perm => `\`${perm}\``).join(', ')
                    : 'None'
            }
**Bot Permissions:** ${command.permissions.client.map(perm => `\`${perm}\``).join(', ')}
**Developer Only:** ${command.permissions.dev ? 'Yes' : 'No'}
**Slash Command:** ${command.slashCommand ? 'Yes' : 'No'}
**Args:** ${command.args ? 'Yes' : 'No'}
**Player:** ${command.player.active ? 'Yes' : 'No'}
**DJ:** ${command.player.dj ? 'Yes' : 'No'}
**DJ Permissions:** ${command.player.djPerm ? command.player.djPerm : 'None'}
**Voice:** ${command.player.voice ? 'Yes' : 'No'}`);
            ctx.sendMessage({ embeds: [helpEmbed] });
        }
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
