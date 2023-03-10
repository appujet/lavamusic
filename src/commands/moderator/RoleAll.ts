import { Command, Lavamusic, Context } from "../../structures/index.js";
import { ApplicationCommandOptionType, GuildMember, Role, } from "discord.js";

export default class RoleAll extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "roleall",
            description: {
                content: "Adds a role to all users in the server",
                examples: ["roleall @role"],
                usage: "roleall"
            },
            category: "moderator",
            aliases: ["rall"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["ManageRoles"]
            },
            slashCommand: false,
            options: [
                {
                    name: "role",
                    description: "The role you want to add to all users",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const embed = this.client.embed();
        let role: Role | any;
        if (ctx.isInteraction) {
            role = ctx.interaction.options.data[0].value;
        } else {
            role = ctx.message.mentions.roles.first() || ctx.message.guild.roles.cache.get(args[0]);
        }

        if (!role) {
            embed.setDescription("Please provide a valid role").setColor(client.color.red)
            return ctx.sendMessage({ embeds: [embed] });
        }

        let members: any;

        try {
            members = await ctx.guild.members.fetch();
        } catch (error) {
            console.error(`Failed to fetch members: ${error}`);
            return;
        }
        let toGive: any[] = [];

        members.cache.forEach((member: GuildMember) => {
            if (!member.roles.cache.has(role.id)) {
                toGive.push(member);
            }
        });
        await ctx.sendMessage({ content: `Adding role to ${toGive.length} users` });
        toGive.forEach(async (member: GuildMember) => {
            await member.roles.add(role);
        });
        embed.setDescription(`Added role to ${toGive.length} users`).setColor(client.color.green)
        return ctx.editMessage({ embeds: [embed]})

    }
}