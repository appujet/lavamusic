import { Command, Lavamusic, Context } from '../../structures/index.js';
import { ApplicationCommandOptionType } from 'discord.js';

export default class Dj extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: 'dj',
      description: {
        content: "Shows the bot's prefix",
        examples: ['dj add @role', 'dj remove @role', 'dj clear', 'dj toggle'],
        usage: 'dj',
      },
      category: 'general',
      aliases: ['dj'],
      cooldown: 3,
      args: true,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
        user: ['ManageGuild'],
      },
      slashCommand: true,
      options: [
        {
          name: 'add',
          description: 'The dj role you want to add',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'role',
              description: 'The dj role you want to add',
              type: ApplicationCommandOptionType.Role,
              required: true,
            },
          ],
        },
        {
          name: 'remove',
          description: 'The dj role you want to remove',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'role',
              description: 'The dj role you want to remove',
              type: ApplicationCommandOptionType.Role,
              required: true,
            },
          ],
        },
        {
          name: 'clear',
          description: 'Clears all dj roles',
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: 'toggle',
          description: 'Toggles the dj role',
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    });
  }
  public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
    let subCommand: string | any;
    let role: any;
    if (ctx.isInteraction) {
      subCommand = ctx.interaction.options.data[0].name;
      if (subCommand === 'add' || subCommand === 'remove') {
        role = ctx.interaction.options.data[0].options[0].role;
      }
    } else {
      subCommand = args[0];
      role = ctx.message.mentions.roles.first() || ctx.guild.roles.cache.get(args[1]);
    }
    const embed = client.embed().setColor(client.color.main);
    let dj = await this.client.prisma.dj.findUnique({
      where: { guildId: ctx.guild.id },
    });
    if (subCommand === 'add') {
      if (!role)
        return await ctx.sendMessage({
          embeds: [embed.setDescription('Please provide a role to add')],
        });
      const isExRole = await this.client.prisma.roles.findFirst({
        where: { roleId: role.id },
      });
      if (isExRole)
        return await ctx.sendMessage({
          embeds: [embed.setDescription(`The dj role <@&${role.id}> is already added`)],
        });

      if (!dj) {
        await this.client.prisma.dj.create({
          data: {
            guildId: ctx.guild.id,
            roles: {
              create: {
                roleId: role.id,
              },
            },
            mode: true,
          },
        });
        return await ctx.sendMessage({
          embeds: [embed.setDescription(`The dj role <@&${role.id}> has been added`)],
        });
      } else {
        await this.client.prisma.dj.update({
          where: {
            guildId: ctx.guild.id,
          },
          data: {
            mode: true,
            roles: {
              create: {
                roleId: role.id,
              },
            },
          },
        });
        return await ctx.sendMessage({
          embeds: [embed.setDescription(`The dj role <@&${role.id}> has been added`)],
        });
      }
    } else if (subCommand === 'remove') {
      if (!role)
        return await ctx.sendMessage({
          embeds: [embed.setDescription('Please provide a role to remove')],
        });
      const isExRole = await this.client.prisma.roles.findFirst({
        where: { roleId: role.id },
      });
      if (!isExRole)
        return await ctx.sendMessage({
          embeds: [embed.setDescription(`The dj role <@&${role.id}> is not added`)],
        });
      await this.client.prisma.roles.delete({ where: { roleId: role.id } });
      return await ctx.sendMessage({
        embeds: [embed.setDescription(`The dj role <@&${role.id}> has been removed`)],
      });
    } else if (subCommand === 'clear') {
      if (!dj)
        return await ctx.sendMessage({
          embeds: [embed.setDescription('There are no dj roles to clear')],
        });
      await this.client.prisma.roles.deleteMany({
        where: { guildId: ctx.guild.id },
      });
      return await ctx.sendMessage({
        embeds: [embed.setDescription(`All dj roles have been removed`)],
      });
    } else if (subCommand === 'toggle') {
      if (!dj)
        return await ctx.sendMessage({
          embeds: [embed.setDescription('There are no dj roles to toggle')],
        });
      const data = await this.client.prisma.dj.findUnique({
        where: { guildId: ctx.guild.id },
      });
      if (data) {
        await this.client.prisma.dj.update({
          where: {
            guildId: ctx.guild.id,
          },
          data: {
            mode: !data.mode,
          },
        });
        return await ctx.sendMessage({
          embeds: [embed.setDescription(`The dj mode has been toggled to ${!data.mode ? 'enabled' : 'disabled'}`)],
        });
      }
    } else {
      return await ctx.sendMessage({
        embeds: [embed.setDescription('Please provide a valid subcommand').addFields({ name: 'Subcommands', value: '`add`, `remove`, `clear`, `toggle`' })],
      });
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
