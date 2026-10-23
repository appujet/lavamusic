import type {
	APIApplicationCommandOption,
	AutocompleteInteraction,
	PermissionResolvable,
} from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { type TKey, t } from "./I18n";
import type Lavamusic from "./Lavamusic";

/** `Omit` that keeps discriminated unions intact. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/**
 * Slash command option whose description is a translation selector.
 * `description` and `options` are replaced so nested options also use selectors.
 */
export type CommandOption = DistributiveOmit<
	APIApplicationCommandOption,
	"description" | "description_localizations" | "name_localizations" | "options"
> & {
	description: TKey;
	options?: CommandOption[];
};

interface CommandDescription {
	content: TKey;
	usage: string;
	examples: string[];
}

interface CommandPlayer {
	voice: boolean;
	dj: boolean;
	active: boolean;
	djPerm: string | null;
}

interface CommandPermissions {
	dev: boolean;
	client: PermissionResolvable;
	user: PermissionResolvable;
}

interface CommandOptions {
	name: string;
	description?: Partial<CommandDescription>;
	aliases?: string[];
	cooldown?: number;
	args?: boolean;
	vote?: boolean;
	player?: Partial<CommandPlayer>;
	permissions?: Partial<CommandPermissions>;
	slashCommand?: boolean;
	options?: CommandOption[];
	category?: string;
}

export default class Command {
	public client: Lavamusic;
	public name: string;
	public description: CommandDescription;
	public aliases: string[];
	public cooldown: number;
	public args: boolean;
	public vote: boolean;
	public player: CommandPlayer;
	public permissions: CommandPermissions;
	public slashCommand: boolean;
	public options: CommandOption[];
	public category: string;

	constructor(client: Lavamusic, options: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = {
			content: options.description?.content ?? (($) => $.commands.messages.no_description),
			usage: options.description?.usage ?? t(($) => $.commands.messages.no_usage),
			examples: options.description?.examples ?? [t(($) => $.commands.messages.no_examples)],
		};
		this.aliases = options.aliases ?? [];
		this.cooldown = options.cooldown ?? 3;
		this.args = options.args ?? false;
		this.vote = options.vote ?? false;
		this.player = {
			voice: options.player?.voice ?? false,
			dj: options.player?.dj ?? false,
			active: options.player?.active ?? false,
			djPerm: options.player?.djPerm ?? null,
		};
		this.permissions = {
			dev: options.permissions?.dev ?? false,
			client: options.permissions?.client ?? [
				PermissionFlagsBits.SendMessages,
				PermissionFlagsBits.ViewChannel,
				PermissionFlagsBits.EmbedLinks,
			],
			user: options.permissions?.user ?? [],
		};
		this.slashCommand = options.slashCommand ?? false;
		this.options = options.options ?? [];
		this.category = options.category ?? "general";
	}

	public async run(_client: Lavamusic, _message: any, _args: string[]): Promise<any> {
		return await Promise.resolve();
	}

	public async autocomplete(_interaction: AutocompleteInteraction): Promise<void> {
		return await Promise.resolve();
	}
}
