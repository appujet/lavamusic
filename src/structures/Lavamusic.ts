import { Collection, ClientOptions, Client, EmbedBuilder } from "discord.js";
import { prisma } from "../prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import Logger from "./Logger.js";
import config from "../config.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default class Lavamusic extends Client {
    public commands: Collection<string, any> = new Collection();
    public aliases: Collection<string, any> = new Collection();
    public prisma = prisma;
    public cooldowns: Collection<string, any> = new Collection();
    public config = config;
    public logger: Logger = new Logger();
    
    public constructor(options: ClientOptions) {
        super(options);
        
    }
    public embed(): EmbedBuilder {
        return new EmbedBuilder();
    }
    public async start(token: string): Promise<string> {
        this.loadCommands();
        this.loadEvents();
        return await this.login(token);
    };

    private loadCommands(): void {
        const commandsPath = fs.readdirSync(path.join(__dirname, '../commands'));
        commandsPath.forEach((dir) => {
            const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${dir}`)).filter((file) => file.endsWith(".js"));
            commandFiles.forEach(async (file) => {
                const cmd = (await import(`../commands/${dir}/${file}`)).default;
                const command = new cmd(this, file);
                command.category = dir;
                command.file = file;
                this.commands.set(command.name, command);
                if (command.aliases.length !== 0) {
                    command.aliases.forEach((alias: any) => {
                        this.aliases.set(alias, command.name);
                    });
                }
            });
        });
    };

    private loadEvents(): void {
        const eventsPath = fs.readdirSync(path.join(__dirname, "../events"));
        eventsPath.forEach((dir) => {
            const events = fs.readdirSync(path.join(__dirname, `../events/${dir}`)).filter((file) => file.endsWith(".js"));
            events.forEach(async (file) => {
                const event = (await import(`../events/${dir}/${file}`)).default;
                const evt = new event(this, file);
                this.on(evt.name, (...args: any) => evt.run(...args));
            });
        });
    };
};

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */