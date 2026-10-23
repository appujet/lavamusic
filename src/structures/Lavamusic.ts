import { Api } from "@top-gg/sdk";
import {
	type APIApplicationCommandOption,
	ApplicationCommandType,
	Client,
	Collection,
	EmbedBuilder,
	PermissionsBitField,
	REST,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes,
} from "discord.js";
import { CommandList } from "../commands";
import { ComponentList } from "../components";
import config from "../config";
import ServerData from "../database/server";
import { env } from "../env";
import { EventList } from "../events";
import { LavamusicEventType } from "../types/events";
import * as Utils from "../utils/Utils";
import { initI18n, resolveDescription, resolveLocalizations, sanitizeName } from "./I18n";
import type { Command, Component } from "./index";
import LavalinkClient from "./LavalinkClient";
import logger from "./Logger";

export default class Lavamusic extends Client {
	// Collections for internal state management
	public commands: Collection<string, Command> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public cooldown: Collection<string, any> = new Collection();
	public components: Collection<string, Component> = new Collection();

	// Database and config
	public db = new ServerData();
	public config = config;
	public readonly emoji = config.emoji;
	public readonly color = config.color;

	// Utilities and Environment
	public utils = Utils;
	public env: typeof env = env;

	// Services
	public topGG!: Api;
	public manager!: LavalinkClient;
	public rest = new REST({ version: "10" }).setToken(env.TOKEN ?? "");

	// Slash command payload sent to Discord on deploy
	private body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

	public embed(): EmbedBuilder {
		return new EmbedBuilder();
	}

	/**
	 * Initializes i18n, services, commands, events and components, then logs in.
	 */
	public async start(token: string): Promise<void> {
		await initI18n();

		if (env.TOPGG) {
			this.topGG = new Api(env.TOPGG);
		} else {
			logger.warn("Top.gg token not found! Skipping Top.gg API initialization");
		}

		this.manager = new LavalinkClient(this);

		try {
			await this.loadCommands();
			await this.loadEvents();
			this.loadComponents();
			logger.info("Commands, Events, and Components loaded successfully!");

			await this.login(token);
		} catch (error) {
			logger.error("Critical error during startup:", error);
			process.exit(1);
		}
	}

	/**
	 * Instantiates every command from the registry and builds the slash command payload.
	 * Safe to call more than once: it resets internal state first.
	 */
	public async loadCommands(): Promise<void> {
		this.commands.clear();
		this.aliases.clear();
		this.body = [];

		for (const CommandClass of CommandList) {
			try {
				/**
				 * The registry already imports the class, so we receive the constructor here.
				 * The class name is passed as the `file` identifier for debugging purposes.
				 */
				const command = new (CommandClass as any)(this, CommandClass.name);

				// Category should be set via the Command constructor options
				if (!command.category) command.category = "general";

				this.commands.set(command.name, command);

				for (const alias of command.aliases) {
					this.aliases.set(alias, command.name);
				}

				if (command.slashCommand) {
					this.body.push(this.prepareCommandData(command));
				}
			} catch (error) {
				logger.error(`Failed to load command ${CommandClass.name}:`, error);
			}
		}
	}

	/**
	 * Builds the Discord payload for a slash command.
	 * Descriptions are translation selectors, resolved here to the base text (English)
	 * plus a localization map for every other supported language.
	 */
	private prepareCommandData(command: Command): RESTPostAPIChatInputApplicationCommandsJSONBody {
		if (sanitizeName(command.name) !== command.name) {
			logger.warn(`[i18n] Command name "${command.name}" is not a valid Discord name.`);
		}

		return {
			name: command.name,
			description: resolveDescription(command.description.content),
			description_localizations: resolveLocalizations(command.description.content, "description"),
			type: ApplicationCommandType.ChatInput,
			options: command.options?.map((opt) => this.processCommandOptions(opt)) ?? [],
			default_member_permissions:
				Array.isArray(command.permissions.user) && command.permissions.user.length > 0
					? PermissionsBitField.resolve(command.permissions.user).toString()
					: null,
		};
	}

	/**
	 * Recursively resolves option descriptions (selectors) into plain strings
	 * and localization maps. The selector never reaches the Discord API payload,
	 * because `description` is overwritten.
	 */
	private processCommandOptions(option: any): APIApplicationCommandOption {
		if (sanitizeName(option.name) !== option.name) {
			logger.warn(`[i18n] Option name "${option.name}" is not a valid Discord name.`);
		}

		return {
			...option,
			description: resolveDescription(option.description),
			description_localizations: resolveLocalizations(option.description, "description"),
			options: option.options?.map((sub: any) => this.processCommandOptions(sub)),
		};
	}

	/**
	 * Synchronizes slash commands with the Discord API.
	 *
	 * @param guildId - If provided, syncs to a specific guild. Otherwise, syncs globally.
	 * @param clear - If true, removes all commands (undeploy). Defaults to false.
	 */
	public async syncCommands(guildId?: string, clear = false): Promise<void> {
		const userId = this.user?.id;
		if (!userId) {
			logger.error(
				"[DEPLOY]: Client ID not found. Ensure the bot is logged in before sync commands.",
			);
			return;
		}

		// Empty array removes every command; otherwise send the current payload
		let commandsBody = clear ? [] : this.body;

		// If deploying with an empty payload, try loading the commands once
		if (!clear && commandsBody.length === 0) {
			logger.warn("Command body is empty. Attempting to reload commands before deployment...");
			await this.loadCommands();
			commandsBody = this.body;
		}

		const route = guildId
			? Routes.applicationGuildCommands(userId, guildId)
			: Routes.applicationCommands(userId);

		const action = clear ? "removed" : "deployed";
		const scope = guildId ? `in guild ${guildId}` : "globally";

		try {
			await this.rest.put(route, { body: commandsBody });
			logger.info(`Successfully ${action} ${commandsBody.length} slash commands ${scope}!`);
		} catch (error) {
			logger.error(`Failed to ${clear ? "undeploy" : "deploy"} commands ${scope}:`, error);
			throw error;
		}
	}

	/**
	 * Instantiates events from the registry and attaches each one to the right emitter
	 * (Lavalink player, Lavalink node, or Discord client) based on its type.
	 */
	private async loadEvents(): Promise<void> {
		for (const EventClass of EventList) {
			try {
				const event = new (EventClass as any)(this, EventClass.name);

				switch (event.type) {
					case LavamusicEventType.Player:
						this.manager.on(event.name as any, (...args: any[]) => event.run(...args));
						break;

					case LavamusicEventType.Node:
						this.manager.nodeManager.on(event.name as any, (...args: any[]) => event.run(...args));
						break;

					case LavamusicEventType.Client:
						this.on(event.name, (...args: any[]) => event.run(...args));
						break;

					default:
						logger.warn(`Event ${event.name} has unknown type: ${event.type}`);
				}
			} catch (error) {
				logger.error(`Failed to load event ${EventClass.name}:`, error);
			}
		}
	}

	/**
	 * Instantiates components (buttons, menus...) from the registry
	 * and indexes them by name and aliases.
	 */
	private loadComponents(): void {
		for (const ComponentClass of ComponentList) {
			try {
				const component = new (ComponentClass as any)(this, ComponentClass.name);
				this.components.set(component.name, component);

				for (const alias of component.aliases) {
					this.components.set(alias, component);
				}
			} catch (error) {
				logger.error(`Failed to load component ${ComponentClass.name}:`, error);
			}
		}
	}
}
