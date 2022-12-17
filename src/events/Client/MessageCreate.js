import Event from "../../structures/Event.js";
import Context from "../../structures/Context.js";
import { getPrefix } from "../../handlers/functions.js";
import { Message, ChannelType, PermissionFlagsBits, Collection } from "discord.js";
import Dj from "../../schemas/dj.js";
import { getSetup } from "../../handlers/setup.js";


export default class MessageCreate extends Event {
    constructor(...args) {
        super(...args);
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (message.partial) await message.fetch();
        const data = await getSetup(message.guild.id);
        if (data && data.Channel && message.channelId === data.Channel) return this.client.emit("setupSystem", message);
        const ctx = new Context(message);
        const prefix = await getPrefix(message.guild.id, this.client);
        
        const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            if (message.channel.permissionsFor(this.client.user).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ViewChannel])) {
                return await message.reply({ content: `Hey, my prefix for this server is \`${prefix}\` Want more info? then do \`${prefix}help\`\nStay Safe, Stay Awesome!` }).catch(() => { });
            }
        }

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));

        ctx.setArgs(args);

        if (!command) return;
        this.client.logger.cmd('%s used by %s from %s', commandName, ctx.author.id, ctx.guild.id);
        let dm = message.author.dmChannel;
        if (typeof dm === 'undefined') dm = await message.author.createDM();

        if (!message.inGuild() || !message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)) return;

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) return await message.author.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in \`${message.guild.name}\`\nchannel: <#${message.channelId}>` }).catch(() => { });

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) return await message.channel.send({ content: 'I don\'t have **`EMBED_LINKS`** permission.' }).catch(() => { });

        if (command.permissions) {
            if (command.permissions.client) {
                if (!message.guild.members.me.permissions.has(command.permissions.client)) return await message.reply({ content: 'I don\'t have enough permissions to execute this command.' });
            }

            if (command.permissions.user) {
                if (!message.member.permissions.has(command.permissions.user)) return await message.reply({ content: 'You don\'t have enough permissions to use this command.' });

            }
            if (command.permissions.dev) {
                if (this.client.config.ownerID) {
                    const findDev = this.client.config.ownerID.find((x) => x === message.author.id);
                    if (!findDev) return;
                }
            }
        }

        if (command.player) {
            if (command.player.voice) {
                if (!message.member.voice.channel) return await message.reply({ content: `You must be connected to a voice channel to use this \`${command.name}\` command.` });

                if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak)) return await message.reply({ content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.` });

                if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak)) return await message.reply({ content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.` });

                if (message.member.voice.channel.type === ChannelType.GuildStageVoice && !message.guild.members.me.permissions.has(PermissionFlagsBits.RequestToSpeak)) return await message.reply({ content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.` });

                if (message.guild.members.me.voice.channel) {
                    if (message.guild.members.me.voice.channelId !== message.member.voice.channelId) return await message.reply({ content: `You are not connected to ${message.guild.members.me.voice.channel} to use this \`${command.name}\` command.` });
                }
            }

            if (command.player.active) {
                if (!this.client.manager.getPlayer(message.guildId)) return await message.reply({ content: 'Nothing is playing right now.' });
                if (!this.client.manager.getPlayer(message.guildId).queue) return await message.reply({ content: 'Nothing is playing right now.' });
                if (!this.client.manager.getPlayer(message.guildId).current) return await message.reply({ content: 'Nothing is playing right now.' });
            }
            if (command.player.dj) {
                let data = await Dj.findOne({ _id: message.guildId });
                let perm = 'MuteMembers';
                if (data) {
                    if (data.Mode) {
                        let pass = false;
                        if (data.Roles.length > 0) {
                            message.member.roles.cache.forEach((x) => {
                                let role = data.Roles.find((r) => r === x.id);
                                if (role) pass = true;
                            });
                        };
                        if (!pass && !message.member.permissions.has(perm)) return message.channel.send({ content: `You need to have the \`${perm}\` permission or a DJ role to use this command.` });
                    };
                };
            }
        }
        if (command.args) {
            if (!args.length) return await message.reply({ content: `Please provide the required arguments. \`${command.description.examples}\`` });
        }
        if (!this.client.cooldowns.has(commandName)) {
            this.client.cooldowns.set(commandName, new Collection());
        }
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(commandName);

        const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            const timeLeft = (expirationTime - now) / 1000;
            if (now < expirationTime && timeLeft > 0.9) {
                return message.reply({ content: `${this.client.config.emojis.error} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.` });
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            return await command.run(ctx, ctx.args);

        } catch (error) {
            await message.channel.send({ content: 'An unexpected error occured, the developers have been notified!' }).catch(() => { });
            console.error(error);
        }
    }
};