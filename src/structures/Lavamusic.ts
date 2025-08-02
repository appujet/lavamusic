/** biome-ignore-all lint/style/noNonNullAssertion: explanation */
import fs from "node:fs";
import path from "node:path";
import { Api } from "@top-gg/sdk";
import {
	ApplicationCommandType,
	Client,
	Collection,
	EmbedBuilder,
	Events,
	type Interaction,
	PermissionsBitField,
	REST,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes,
} from "discord.js";
import { Locale } from "discord.js";
import config from "../config";
import ServerData from "../database/server";
import { env } from "../env";
import loadPlugins from "../plugin/index";
import { Utils } from "../utils/Utils";
import { T, i18n, initI18n, localization } from "./I18n";
import LavalinkClient from "./LavalinkClient";
import Logger from "./Logger";
import type { Command } from "./index";

export default class Lavamusic extends Client {
	public commands: Collection<string, Command> = new Collection();
	public aliases: Collection<string, any> = new Collection();
	public db = new ServerData();
	public cooldown: Collection<string, any> = new Collection();
	public config = config;
	public logger: Logger = new Logger();
	public readonly emoji = config.emoji;
	public readonly color = config.color;
	private body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
	public topGG!: Api;
	public utils = Utils;
	public env: typeof env = env;
	public manager!: LavalinkClient;
	public rest = new REST({ version: "10" }).setToken(env.TOKEN ?? "");
	public embed(): EmbedBuilder {
		return new EmbedBuilder();
	}

	public async start(token: string): Promise<void> {
		initI18n();
		if (env.TOPGG) {
			this.topGG = new Api(env.TOPGG);
		} else {
			this.logger.warn("Top.gg token not found!");
		}
		this.manager = new LavalinkClient(this);
		await this.loadCommands();
		this.logger.info("Successfully loaded commands!");
		await this.loadEvents();
		this.logger.info("Successfully loaded events!");
		loadPlugins(this);
		await this.login(token);

		this.on(Events.InteractionCreate, async (interaction: Interaction) => {
			if (interaction.isButton() && interaction.guildId) {
				const setup = await this.db.getSetup(interaction.guildId);
				if (
					setup &&
					interaction.channelId === setup.textId &&
					interaction.message.id === setup.messageId
				) {
					this.emit("setupButtons", interaction);
				}
			}
		});
	}

	private async loadCommands(): Promise<void> {
		const commandsPath = fs.readdirSync(
			path.join(process.cwd(), "dist", "commands"),
		);

		for (const dir of commandsPath) {
			const commandFiles = fs
				.readdirSync(path.join(process.cwd(), "dist", "commands", dir))
				.filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const cmdModule = require(
					path.join(process.cwd(), "dist", "commands", dir, file),
				);
				const command: Command = new cmdModule.default(this, file);
				command.category = dir;

				this.commands.set(command.name, command);
				command.aliases.forEach((alias: string) => {
					this.aliases.set(alias, command.name as any);
				});

				if (command.slashCommand) {
					const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
						name: command.name,
						description: T(Locale.EnglishUS, command.description.content),
						type: ApplicationCommandType.ChatInput,
						options: command.options || [],
						default_member_permissions:
							Array.isArray(command.permissions.user) &&
							command.permissions.user.length > 0
								? PermissionsBitField.resolve(
										command.permissions.user as any,
									).toString()
								: null,
						name_localizations: null,
						description_localizations: null,
					};

					const localizations: { name: any[]; description: string[] }[] = [];
					i18n.getLocales().map((locale: any) => {
						localizations.push(
							localization(locale, command.name, command.description.content),
						);
					});

					for (const localization of localizations) {
						const [language, name] = localization.name;
						const [language2, description] = localization.description;
						data.name_localizations = {
							...data.name_localizations,
							[language]: name,
						};
						data.description_localizations = {
							...data.description_localizations,
							[language2]: description,
						};
					}

					if (command.options.length > 0) {
						command.options.map((option) => {
							const optionsLocalizations: {
								name: any[];
								description: string[];
							}[] = [];
							i18n.getLocales().map((locale: any) => {
								optionsLocalizations.push(
									localization(locale, option.name, option.description),
								);
							});

							for (const localization of optionsLocalizations) {
								const [language, name] = localization.name;
								const [language2, description] = localization.description;
								option.name_localizations = {
									...option.name_localizations,
									[language]: name,
								};
								option.description_localizations = {
									...option.description_localizations,
									[language2]: description,
								};
							}
							option.description = T(Locale.EnglishUS, option.description);
						});

						data.options?.map((option) => {
							if ("options" in option && option.options!.length > 0) {
								option.options?.map((subOption) => {
									const subOptionsLocalizations: {
										name: any[];
										description: string[];
									}[] = [];
									i18n.getLocales().map((locale: any) => {
										subOptionsLocalizations.push(
											localization(
												locale,
												subOption.name,
												subOption.description,
											),
										);
									});

									for (const localization of subOptionsLocalizations) {
										const [language, name] = localization.name;
										const [language2, description] = localization.description;
										subOption.name_localizations = {
											...subOption.name_localizations,
											[language]: name,
										};
										subOption.description_localizations = {
											...subOption.description_localizations,
											[language2]: description,
										};
									}
									subOption.description = T(
										Locale.EnglishUS,
										subOption.description,
									);
								});
							}
						});
					}
					this.body.push(data);
				}
			}
		}
	}

	public async deployCommands(guildId?: string): Promise<void> {
		const route = guildId
			? Routes.applicationGuildCommands(this.user?.id ?? "", guildId)
			: Routes.applicationCommands(this.user?.id ?? "");

		try {
			await this.rest.put(route, { body: this.body });
			this.logger.info("Successfully deployed slash commands!");
		} catch (error) {
			this.logger.error(error);
		}
	}

	private async loadEvents(): Promise<void> {
		const eventsPath = fs.readdirSync(
			path.join(process.cwd(), "dist", "events"),
		);

		for (const dir of eventsPath) {
			const eventFiles = fs
				.readdirSync(path.join(process.cwd(), "dist", "events", dir))
				.filter((file) => file.endsWith(".js"));

			for (const file of eventFiles) {
				const eventModule = require(
					path.join(process.cwd(), "dist", "events", dir, file),
				);
				const event = new eventModule.default(this, file);

				if (dir === "player") {
					this.manager.on(event.name, (...args: any) => event.run(...args));
				} else if (dir === "node") {
					this.manager.nodeManager.on(event.name, (...args: any) =>
						event.run(...args),
					);
				} else {
					this.on(event.name, (...args) => event.run(...args));
				}
			}
		}
	}
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
