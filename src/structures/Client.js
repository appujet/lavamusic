import { Client, ButtonStyle, Routes, REST, ActionRowBuilder, PermissionsBitField, ApplicationCommandType, GatewayIntentBits, Partials, Collection, EmbedBuilder, ButtonBuilder } from 'discord.js';
import { readdirSync } from 'fs';
import pkg from 'mongoose';
const { connect } = pkg;
import { config } from '../config.js';
import Logger from './Logger.js';
import ShoukakuClient from './Shoukaku.js';
export class BotClient extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ['users', 'roles', 'everyone'],
                repliedUser: false,
            },
             intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildInvites,
            ],
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.Reaction],
            restTimeOffset: 0,
            restRequestTimeout: 20000,

        });
        this.config = config;
        if (!this.token) this.token = this.config.bot.token;
        this.manager = new ShoukakuClient(this);
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });
    }
    embed() {
        return new EmbedBuilder()
    }
    async loadEvents() {
        let i = 0;
        const eventFiles = readdirSync('./src/events');
        eventFiles.forEach(async (file) => {
            const events = readdirSync(`./src/events/${file}`).filter(c => c.split('.').pop() === 'js');
            events.forEach(async (event) => {
                const Event = (await import(`../events/${file}/${event}`)).default;
                const eventClass = new Event(this, Event);
                this.events.set(eventClass.name, eventClass);
                const eventName = event.split('.')[0].charAt(0).toLowerCase() + event.split('.')[0].slice(1);

                switch (file) {
                    case 'player':
                        this.manager.on(eventName, (...args) => eventClass.run(...args));
                        i++;
                        break;
                    default:
                        this.on(eventName, (...args) => eventClass.run(...args));
                        i++;
                        break;
                }
            });
        });
        this.logger.event(`Loaded ${this.events.size} events`);
    }
    async loadCommands() {
        let i = 0;
        const cmdData = [];
        const commandFiles = readdirSync('./src/commands');
        commandFiles.forEach(file => {
            const commands = readdirSync(`./src/commands/${file}`).filter(file => file.endsWith('.js'));
            commands.forEach(async (command) => {
                const Command = (await import(`../commands/${file}/${command}`)).default;
                const cmd = new Command(this, Command);
                cmd.file = Command;
                cmd.fileName = Command.name;
                this.commands.set(cmd.name, cmd);
                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                    cmd.aliases.forEach(alias => {
                        this.aliases.set(alias, cmd.name);
                    });
                }
                if (cmd.slashCommand) {
                    const data = {
                        name: cmd.name,
                        description: cmd.description.content,
                        type: ApplicationCommandType.ChatInput,
                        options: cmd.options ? cmd.options : null,
                        name_localizations: cmd.nameLocalizations ? cmd.nameLocalizations : null,
                        description_localizations: cmd.descriptionLocalizations ? cmd.descriptionLocalizations : null,
                    };
                    if (cmd.permissions.user.length > 0) data.default_member_permissions = cmd.permissions.user ? PermissionsBitField.resolve(cmd.permissions.user).toString() : 0;
                    cmdData.push(data);
                    i++;
                }
                (async () => {
                    try {
                        const rest = new REST({ version: '10' }).setToken(this ? this.config.token : config.token);
                        const loaded = await rest.put(Routes.applicationCommands(this ? this.config.clientId : config.clientId), { body: cmdData });
                        this.logger.ready(`Successfully registered application ${loaded ? loaded.length : 0} commands.`);
                    } catch (e) {
                        this.logger.error(e);
                    }
                })();
            });
             // this.logger.ready(`Successfully loaded message command ${i}.`);
        });

    }
    async connectMongodb() {
        await connect(this.config.mongourl);
        this.logger.ready('Connected to MongoDB');
    }
    async start() {
        super.login(this.token);
        this.connectMongodb();
        this.loadEvents();
        this.loadCommands();
    }
}