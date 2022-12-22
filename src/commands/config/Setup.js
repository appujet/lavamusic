import { getSetup } from "../../handlers/setup.js";
import Command from "../../structures/Command.js";
import { ChannelType, PermissionFlagsBits } from "discord.js";
import { getButtons } from "../../handlers/playerButtons.js";
import SetupData from "../../schemas/setup.js";

export default class Setup extends Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            description: {
                content: 'Setup song request channel.',
                usage: '<set | delete>',
                examples: ['setup set', 'setup delete'],
            },
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
                    name: "set",
                    description: "create a new setup channel.",
                    type: 1,
                },
                {
                    name: "delete",
                    description: "delete the setup channel.",
                    type: 1,
                }
            ]
        });
    }
    async run(ctx, args) {
        const embed = this.client.embed();
        let data = await getSetup(ctx.guild.id);
        let subCommand;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
        } else {
            subCommand = args[0];
        }
        switch (subCommand) {
            case "set":
                if (!data) {
                    const textChannel = await ctx.guild.channels.create({
                        name: `${this.client.user.username}-song-requests`,
                        type: ChannelType.GuildText,
                        topic: "Song requests for the music bot",
                        permissionOverwrites: [
                            {
                                type: "member",
                                id: this.client.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                type: "role",
                                id: ctx.guild.roles.everyone.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ]
                    });
                    const player = await this.client.manager.getPlayer(ctx.guild.id);
                    const image = this.client.config.links.img;
                    const desc = player && player.queue && player.current ? `[${player.current.info.title}](${player.current.info.uri})` : 'Nothing playing right now';
                   
                    let embed1 = this.client.embed()
                        .setColor(this.client.color.default)
                        .setDescription(desc)
                        .setImage(image)
                    const buttons = await getButtons();
                   
                    const msg = await textChannel.send({ embeds: [embed1], components: buttons });
                    data = new SetupData({
                        _id: ctx.guild.id,
                        Channel: textChannel.id,
                        Message: msg.id,
                    });
                    data.save();
                    return ctx.sendMessage({
                        embeds: [embed.setColor(this.client.color.success).setTitle("Setup Finished").setDescription(`**Song request channel has been created.**\n\nChannel: ${textChannel}\n\nNote: Deleting the template embed in there may cause this setup to stop working. (Please don't delete it.)*`)]
                    });
                } else {
                     ctx.sendMessage({
                        embeds: [embed.setColor(this.client.color.error).setTitle("Setup Failed").setDescription("Setup already exists.")]
                    });
                }
                break;
            case "delete":
                if (data) {
                    const channel = ctx.guild.channels.cache.get(data.Channel);
                    if (channel) {
                        channel.delete();
                    }
                    data.delete();
                    return ctx.sendMessage({
                        embeds: [embed.setColor(this.client.color.success).setTitle("Setup Finished").setDescription("Setup has been deleted.")]
                    });
                } else {
                     ctx.sendMessage({
                        embeds: [embed.setColor(this.client.color.error).setTitle("Setup Failed").setDescription("Setup doesn't exist.")]
                    });
                }
                break;
            default:
                return ctx.sendMessage({
                    embeds: [embed.setColor(this.client.color.error).setDescription(`**Invalid subcommand.**\n\nUsage: \`setup <set | delete>\``)]
                });
            
        }
    }
}