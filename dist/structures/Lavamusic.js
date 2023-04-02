import { Collection, Routes, REST, PermissionsBitField, ApplicationCommandType, Client, EmbedBuilder, } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './Logger.js';
import config from '../config.js';
import loadPlugins from '../plugin/index.js';
import { ShoukakuClient, Queue } from './index.js';
import { Utils } from '../utils/Utils.js';
import { PrismaClient } from '@prisma/client';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default class Lavamusic extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.prisma = new PrismaClient();
        this.cooldowns = new Collection();
        this.config = config;
        this.logger = new Logger();
        this.color = config.color;
        this.body = [];
        this.utils = Utils;
        this.queue = new Queue(this);
        this.shoukaku = new ShoukakuClient(this);
    }
    embed() {
        return new EmbedBuilder();
    }
    async start(token) {
        this.loadCommands();
        this.logger.info(`Successfully loaded commands!`);
        this.loadEvents();
        this.logger.info(`Successfully loaded events!`);
        this.prisma
            .$connect()
            .then(() => {
            this.logger.success(`Connected to the database!`);
        })
            .catch((err) => {
            this.logger.error(`Unable to connect to the database!`);
            this.logger.error(err);
        });
        loadPlugins(this);
        return await this.login(token);
    }
    loadCommands() {
        const commandsPath = fs.readdirSync(path.join(__dirname, '../commands'));
        commandsPath.forEach((dir) => {
            const commandFiles = fs
                .readdirSync(path.join(__dirname, `../commands/${dir}`))
                .filter((file) => file.endsWith('.js'));
            commandFiles.forEach(async (file) => {
                const cmd = (await import(`../commands/${dir}/${file}`)).default;
                const command = new cmd(this, file);
                command.category = dir;
                command.file = file;
                this.commands.set(command.name, command);
                if (command.aliases.length !== 0) {
                    command.aliases.forEach((alias) => {
                        this.aliases.set(alias, command.name);
                    });
                }
                if (command.slashCommand) {
                    const data = {
                        name: command.name,
                        description: command.description.content,
                        type: ApplicationCommandType.ChatInput,
                        options: command.options ? command.options : null,
                        name_localizations: command.nameLocalizations ? command.nameLocalizations : null,
                        description_localizations: command.descriptionLocalizations ? cmd.descriptionLocalizations : null,
                        default_member_permissions: command.permissions.user.length > 0 ? command.permissions.user : null,
                    };
                    if (command.permissions.user.length > 0) {
                        const permissionValue = PermissionsBitField.resolve(command.permissions.user);
                        if (typeof permissionValue === 'bigint') {
                            data.default_member_permissions = permissionValue.toString();
                        }
                        else {
                            data.default_member_permissions = permissionValue;
                        }
                    }
                    const json = JSON.stringify(data);
                    this.body.push(JSON.parse(json));
                }
            });
        });
        this.once('ready', async () => {
            const applicationCommands = this.config.production === true
                ? Routes.applicationCommands(this.config.clientId ?? '')
                : Routes.applicationGuildCommands(this.config.clientId ?? '', this.config.guildId ?? '');
            try {
                const rest = new REST({ version: '9' }).setToken(this.config.token ?? '');
                await rest.put(applicationCommands, { body: this.body });
                this.logger.info(`Successfully loaded slash commands!`);
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    loadEvents() {
        const eventsPath = fs.readdirSync(path.join(__dirname, '../events'));
        eventsPath.forEach((dir) => {
            const events = fs.readdirSync(path.join(__dirname, `../events/${dir}`)).filter((file) => file.endsWith('.js'));
            events.forEach(async (file) => {
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
            });
        });
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
//# sourceMappingURL=Lavamusic.js.map