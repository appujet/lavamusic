import {
	type APIInteractionGuildMember,
	ChatInputCommandInteraction,
	type Guild,
	type GuildMember,
	type GuildMemberResolvable,
	type InteractionEditReplyOptions,
	type InteractionReplyOptions,
	Locale,
	Message,
	type MessageCreateOptions,
	type MessageEditOptions,
	type MessagePayload,
	type TextBasedChannel,
	type TextChannel,
	type User,
	type WebhookMessageEditOptions,
} from "discord.js";
import type { TOptions } from "i18next";
import { env } from "../env";
import { type TKey, t } from "./I18n";
import type { Lavamusic } from "./index";

/**
 * Unifies slash commands (interactions) and prefix commands (messages)
 * behind a single API for replying, editing and translating.
 */
export default class Context {
	public ctx: ChatInputCommandInteraction | Message;
	public interaction: ChatInputCommandInteraction | null;
	public message: Message | null;
	public client: Lavamusic;
	public author: User | null;
	public channel: TextBasedChannel;
	public guild: Guild;
	public member: GuildMemberResolvable | GuildMember | APIInteractionGuildMember | null;
	public args: any[];
	public msg: any;
	public guildLocale: string | undefined;

	constructor(ctx: ChatInputCommandInteraction | Message, args: any[]) {
		this.ctx = ctx;
		this.interaction = ctx instanceof ChatInputCommandInteraction ? ctx : null;
		this.message = ctx instanceof Message ? ctx : null;
		this.channel = ctx.channel!;
		this.client = ctx.client as Lavamusic;
		this.author = ctx instanceof Message ? ctx.author : ctx.user;
		this.guild = ctx.guild!;
		this.member = ctx.member;
		this.args = this.interaction ? args.map((arg: any) => arg.value) : args;
		this.guildLocale = env.DEFAULT_LANGUAGE || Locale.EnglishUS;
	}

	public get isInteraction(): boolean {
		return this.ctx instanceof ChatInputCommandInteraction;
	}

	/** Sends a new message (interaction reply or channel message). */
	public async sendMessage(
		content: string | MessagePayload | MessageCreateOptions | InteractionReplyOptions,
	): Promise<Message> {
		if (this.isInteraction) {
			if (typeof content === "string" || isInteractionReplyOptions(content)) {
				this.msg = await this.interaction?.reply(content);
				return this.msg;
			}
		} else if (typeof content === "string" || isMessagePayload(content)) {
			this.msg = await (this.message?.channel as TextChannel).send(content);
			return this.msg;
		}
		return this.msg;
	}

	/** Edits the message previously sent by this context. */
	public async editMessage(
		content: string | MessagePayload | InteractionEditReplyOptions | MessageEditOptions,
	): Promise<Message> {
		if (this.isInteraction && this.msg) {
			this.msg = await this.interaction?.editReply(content);
			return this.msg;
		}
		if (this.msg) {
			this.msg = await this.msg.edit(content);
			return this.msg;
		}
		return this.msg;
	}

	/** Defers the interaction (if needed) and then sends/edits the reply. */
	public async sendDeferMessage(
		content: string | MessagePayload | MessageCreateOptions,
	): Promise<Message> {
		if (this.isInteraction) {
			if (this.interaction && !this.interaction.deferred && !this.interaction.replied) {
				await this.interaction.deferReply();
			}
			this.msg = (await this.interaction?.editReply(
				content as string | MessagePayload | WebhookMessageEditOptions,
			)) as Message;
			return this.msg;
		}

		this.msg = await (this.message?.channel as TextChannel).send(content);
		return this.msg;
	}

	/**
	 * Translates a selector using this context's locale.
	 * Missing translations fall back to English automatically.
	 *
	 * @param key - Selector pointing to the translation string
	 * @param options - Interpolation variables and i18next options
	 *
	 * @example
	 * ctx.locale(($) => $.commands.ping.content)
	 * ctx.locale(($) => $.commands.ping.requested_by, { author: ctx.author?.tag })
	 */
	public locale(key: TKey, options?: TOptions): string {
		return t(key, { lng: this.guildLocale, ...options });
	}

	/** Sends a follow-up message (interaction) or a new channel message. */
	public async sendFollowUp(
		content: string | MessagePayload | MessageCreateOptions | InteractionReplyOptions,
	): Promise<void> {
		if (this.isInteraction) {
			if (typeof content === "string" || isInteractionReplyOptions(content)) {
				await this.interaction?.followUp(content);
			}
		} else if (typeof content === "string" || isMessagePayload(content)) {
			this.msg = await (this.message?.channel as TextChannel).send(content);
		}
	}

	public get deferred(): boolean | undefined {
		return this.isInteraction ? this.interaction?.deferred : !!this.msg;
	}

	/** Shortcuts to read slash command options. */
	options = {
		getRole: (name: string, required = true) => {
			return this.interaction?.options.get(name, required)?.role;
		},
		getMember: (name: string, required = true) => {
			return this.interaction?.options.get(name, required)?.member;
		},
		get: (name: string, required = true) => {
			return this.interaction?.options.get(name, required);
		},
		getChannel: (name: string, required = true) => {
			return this.interaction?.options.get(name, required)?.channel;
		},
		getSubCommand: () => {
			return this.interaction?.options.data[0]?.name;
		},
	};
}

function isInteractionReplyOptions(content: any): content is InteractionReplyOptions {
	return content instanceof Object;
}

function isMessagePayload(content: any): content is MessagePayload {
	return content instanceof Object;
}
