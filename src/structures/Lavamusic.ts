import {
    ApplicationCommandType,
    Client,
    ClientOptions,
    Collection,
    EmbedBuilder,
    Events,
    Interaction,
    PermissionsBitField,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Queue, ShoukakuClient } from './index.js';
import Logger from './Logger.js';
import config from '../config.js';
import ServerData from '../database/server.js';
import loadPlugins from '../plugin/index.js';
import { Utils } from '../utils/Utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Lavamusic extends Client {
    public commands: Collection<string, any> = new Collection();
    public aliases: Collection<string, any> = new Collection();
    public db = new ServerData();
    public cooldown: Collection<string, any> = new Collection();
    public config = config;
    public logger: Logger = new Logger();
    public readonly color = config.color;
    private body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    public shoukaku: ShoukakuClient;
    public utils = Utils;
    public queue = new Queue(this);

    constructor(options: ClientOptions) {
        super(options);
    }

    public embed(): EmbedBuilder {
        return new EmbedBuilder();
    }

    public async start(token: string): Promise<void> {
        const nodes = this.config.autoNode ? await this.getNodes() : this.config.lavalink;
        this.shoukaku = new ShoukakuClient(this, nodes);
        this.loadCommands();
        this.logger.info(`Successfully loaded commands!`);
        this.loadEvents();
        this.logger.info(`Successfully loaded events!`);
        loadPlugins(this);
        await this.login(token);
        this.on(Events.InteractionCreate, async (interaction: Interaction<'cached'>) => {
            if (interaction.isButton()) {
                const setup = await this.db.getSetup(interaction.guildId);
                if (
                    setup &&
                    interaction.channelId === setup.textId &&
                    interaction.message.id === setup.messageId
                ) {
                    this.emit('setupButtons', interaction);
                }
            }
        });
    }

    private async loadCommands(): Promise<void> {
        const commandsPath = fs.readdirSync(path.join(__dirname, '../commands'));
        for (const dir of commandsPath) {
            const commandFiles = fs
                .readdirSync(path.join(__dirname, `../commands/${dir}`))
                .filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const cmd = (await import(`../commands/${dir}/${file}`)).default;
                const command = new cmd(this);
                command.category = dir;
                this.commands.set(command.name, command);
                if (command.aliases.length !== 0) {
                    command.aliases.forEach((alias: any) => {
                        this.aliases.set(alias, command.name);
                    });
                }
                if (command.slashCommand) {
                    const data = {
                        name: command.name,
                        description: command.description.content,
                        type: ApplicationCommandType.ChatInput,
                        options: command.options ?? null,
                        name_localizations: command.nameLocalizations ?? null,
                        description_localizations: command.descriptionLocalizations ?? null,
                        default_member_permissions:
                            command.permissions.user.length > 0
                                ? PermissionsBitField.resolve(command.permissions.user).toString()
                                : null,
                    };
                    this.body.push(JSON.parse(JSON.stringify(data)));
                }
            }
        }
        this.once('ready', async () => {
            const applicationCommands =
                this.config.production === true
                    ? Routes.applicationCommands(this.user.id ?? '')
                    : Routes.applicationGuildCommands(
                          this.user.id ?? '',
                          this.config.guildId ?? ''
                      );
            try {
                const rest = new REST({ version: '9' }).setToken(this.config.token ?? '');
                await rest.put(applicationCommands, { body: this.body });
                this.logger.info(`Successfully loaded slash commands!`);
            } catch (error) {
                this.logger.error(error);
            }
        });
    }

    private async getNodes(): Promise<any> {
        const params = new URLSearchParams({
            ssl: 'false',
            version: 'v4',
            format: 'shoukaku',
        });

        const res = await fetch(`https://lavainfo-api.deno.dev/nodes?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await res.json();
    }

    private async loadEvents(): Promise<void> {
        const eventsPath = fs.readdirSync(path.join(__dirname, '../events'));
        for (const dir of eventsPath) {
            const events = fs
                .readdirSync(path.join(__dirname, `../events/${dir}`))
                .filter(file => file.endsWith('.js'));
            for (const file of events) {
                const event = (await import(`../events/${dir}/${file}`)).default;
                const evt = new event(this, file);
                switch (dir) {
                    case 'player':
                        this.shoukaku.on(evt.name, (...args) => evt.run(...args));
                        break;
                    default:
                        this.on(evt.name, (...args) => evt.run(...args));
                        break;
                }
            }
        }
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
