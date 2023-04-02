import { Event, Lavamusic, Context } from '../../structures/index.js';
import { Message, PermissionFlagsBits, Collection, ChannelType } from 'discord.js';

export default class MessageCreate extends Event {
  constructor(client: Lavamusic, file: string) {
    super(client, file, {
      name: 'messageCreate',
    });
  }
  public async run(message: Message): Promise<any> {
    if (message.author.bot) return;

    let prefix = (await this.client.prisma.guild.findUnique({
      where: {
        guildId: message.guildId,
      },
    })) as any;
    if (!prefix) {
      prefix = this.client.config.prefix;
    } else {
      prefix = prefix.prefix;
    }
    const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      await message.reply({
        content: `Hey, my prefix for this server is \`${prefix}\` Want more info? then do \`${prefix}help\`\nStay Safe, Stay Awesome!`,
      });
      return;
    }
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();
    const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd) as string);
    if (!command) return;
    const ctx = new Context(message, args);
    ctx.setArgs(args);

    let dm = message.author.dmChannel;
    if (typeof dm === 'undefined') dm = await message.author.createDM();

    if (
      !message.inGuild() ||
      !message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)
    )
      return;

    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages))
      return await message.author
        .send({
          content: `I don't have **\`SendMessage\`** permission in \`${message.guild.name}\`\nchannel: <#${message.channelId}>`,
        })
        .catch(() => {});

    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
      return await message.reply({
        content: "I don't have **`EmbedLinks`** permission.",
      });

    if (command.permissions) {
      if (command.permissions.client) {
        if (!message.guild.members.me.permissions.has(command.permissions.client))
          return await message.reply({
            content: "I don't have enough permissions to execute this command.",
          });
      }

      if (command.permissions.user) {
        if (!message.member.permissions.has(command.permissions.user))
          return await message.reply({
            content: "You don't have enough permissions to use this command.",
          });
      }
      if (command.permissions.dev) {
        if (this.client.config.owners) {
          const findDev = this.client.config.owners.find((x) => x === message.author.id);
          if (!findDev) return;
        }
      }
    }
    if (command.player) {
      if (command.player.voice) {
        if (!message.member.voice.channel)
          return await message.reply({
            content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
          });

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
          return await message.reply({
            content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
          });

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
          return await message.reply({
            content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
          });

        if (
          message.member.voice.channel.type === ChannelType.GuildStageVoice &&
          !message.guild.members.me.permissions.has(PermissionFlagsBits.RequestToSpeak)
        )
          return await message.reply({
            content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
          });

        if (message.guild.members.me.voice.channel) {
          if (message.guild.members.me.voice.channelId !== message.member.voice.channelId)
            return await message.reply({
              content: `You are not connected to ${message.guild.members.me.voice.channel} to use this \`${command.name}\` command.`,
            });
        }
      }
      if (command.player.active) {
        if (!this.client.queue.get(message.guildId))
          return await message.reply({
            content: 'Nothing is playing right now.',
          });
        if (!this.client.queue.get(message.guildId).queue)
          return await message.reply({
            content: 'Nothing is playing right now.',
          });
        if (!this.client.queue.get(message.guildId).current)
          return await message.reply({
            content: 'Nothing is playing right now.',
          });
      }
      if (command.player.dj) {
        const data = await this.client.prisma.guild.findUnique({
          where: {
            guildId: message.guildId,
          },
        });
        if (data) {
          const djRole = await this.client.prisma.dj.findUnique({
            where: {
              guildId: message.guildId,
            },
            include: { roles: true },
          });
          if (djRole && djRole.mode) {
            const djRoles = djRole.roles;
            const findDJRole = message.member.roles.cache.find((x: any) => djRoles.includes(x.id));
            if (!findDJRole) {
              if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return await message
                  .reply({
                    content: 'You need to have the DJ role to use this command.',
                  })
                  .then((msg) => setTimeout(() => msg.delete(), 5000));
              }
            }
          }
        }
      }
    }
    if (command.args) {
      if (!args.length) {
        const embed = this.client
          .embed()
          .setColor(this.client.color.red)
          .setTitle('Missing Arguments')
          .setDescription(
            `Please provide the required arguments for the \`${command.name}\` command.\n\nExamples:\n${
              command.description.examples ? command.description.examples.join('\n') : 'None'
            }`,
          )
          .setFooter({ text: 'Syntax: [] = required, <> = optional' });
        return await message.reply({ embeds: [embed] });
      }
    }

    if (!this.client.cooldowns.has(cmd)) {
      this.client.cooldowns.set(cmd, new Collection());
    }
    const now = Date.now();
    const timestamps = this.client.cooldowns.get(cmd);

    const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      const timeLeft = (expirationTime - now) / 1000;
      if (now < expirationTime && timeLeft > 0.9) {
        return message.reply({
          content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd}\` command.`,
        });
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    if (args.includes('@everyone') || args.includes('@here'))
      return await message.reply({
        content: "You can't use this command with everyone or here.",
      });

    try {
      return await command.run(this.client, ctx, ctx.args);
    } catch (error) {
      this.client.logger.error(error);
      await message.reply({ content: `An error occured: \`${error}\`` });
      return;
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
