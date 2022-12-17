import Command from "../../structures/Command.js";
import PrefixData from "../../schemas/prefix.js";

export default class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: {
                content: 'Change the prefix of the bot',
                usage: '<new prefix>',
                examples: ['prefix !'],
            },
            aliases: ['setprefix'],
            category: 'config',
            cooldown: 3,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            slashCommand: true,
            options: [
                {
                    name: "prefix",
                    description: "The new prefix",
                    type: 3,
                    required: true,
                },
            ]
        });
    }
    async run(ctx, args) {
        const embed = this.client.embed();
        const prefix = args.join(" ");

        if (args[0].length > 3)
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Your new prefix must be under `3` characters!")] });

        let data = await PrefixData.findOne({ _id: ctx.guild.id });
        if (!data) {
            data = new PrefixData({
                _id: ctx.guild.id,
                prefix: prefix,
            });
            data.save();
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Set the prefix to \`${prefix}\``)] });
        } else {
            data.prefix = prefix;
            data.save();
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Update the prefix to \`${prefix}\``)] });
        }
    }
};