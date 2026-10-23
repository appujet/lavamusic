import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, parse } from "node:path";
import { Locale, type LocalizationMap } from "discord.js";
import i18next, { type TOptions } from "i18next";
import type { I18nResourceSchema } from "../@types/i18next";
import { LOCALE_SUB_KEYS, type LocaleSubKeys } from "../types/locales";
import logger from "./Logger";

// Resolve path relative to this file's location
const LOCALES_PATH = join(import.meta.dirname, "..", "..", "locales");

const UNSUPPORTED_LOCALES = ["pt-PT"];

/**
 * Single i18next namespace that holds every JSON file of a language.
 * Each file becomes a top-level key (`commands.json` -> `$.commands`), so selectors
 * are plain paths with no namespace ambiguity.
 * Must match `defaultNS` in `src/@types/i18next.d.ts`.
 */
const NAMESPACE = "translation";

/**
 * Discord limitations
 * - `names` must be lowercase, kebab-case, `[a-z0-9_-]`, max 32 chars
 * - `descriptions` must have 1 to 100 chars
 * - localization maps only accept locales known by Discord;
 *	 an unknown makes Discord reject the whole deploy
 */
const MAX_NAME_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 100;
const DISCORD_LOCALES = new Set<string>(Object.values(Locale));

/**
 * Matches dotted path i18next returns when a key is missing
 * in every language (e.g. `commands.ping.description`).
 * Real texts never look like this.
 */
const KEY_PATH_PATTERN = /^[\w$-]+(\.[\w$-]+)+$/;

/**
 * Selector that points to a translation string.
 * `$` is typed from the English JSON files, so typos and keys that point to
 * objects (instead of text) are compile errors.
 *
 * @example
 * const key: TKey = ($) => $.commands.ping.description;
 */
export type TKey = ($: I18nResourceSchema) => string;

/**
 * Initializes i18next by scanning the locales directory.
 * Directories are treated as language codes, and JSON files are merged into
 * a single namespace, using the file name as the first level of the tree.
 */
export async function initI18n() {
	// Detect available files to build the supported languages list
	const languages = existsSync(LOCALES_PATH)
		? readdirSync(LOCALES_PATH).filter((lang) => {
				const fullPath = join(LOCALES_PATH, lang);

				if (!lstatSync(fullPath).isDirectory()) return false;

				if (lang.startsWith(".") || lang.startsWith("_")) return false;
				if (UNSUPPORTED_LOCALES.includes(lang)) return false;

				return true;
			})
		: [];

	await i18next.init({
		fallbackLng: Locale.EnglishUS,
		supportedLngs: languages,
		defaultNS: NAMESPACE,
		ns: [NAMESPACE],
		enableSelector: true, // t($ => $.commands.ping.description)
		interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
		initAsync: false,
	});

	for (const locale of languages) {
		const langPath = join(LOCALES_PATH, locale);
		const files = readdirSync(langPath).filter((file) => file.endsWith(".json"));

		for (const file of files) {
			const name = parse(file).name; // e.g., "commands" from "commands.json"
			try {
				const content = JSON.parse(readFileSync(join(langPath, file), "utf8"));
				// deep merge: each file is added under its own name inside the shared namespace
				i18next.addResourceBundle(locale, NAMESPACE, { [name]: content }, true, true);
			} catch (err) {
				logger.error(`[i18n] Failed to load ${name} in ${locale}: ${err}`);
			}
		}
	}

	// These languages work in the bot, but Discord would reject them in localization maps
	const nonDiscord = languages.filter((lng) => !DISCORD_LOCALES.has(lng));
	if (nonDiscord.length > 0) {
		logger.warn(
			`[i18n] Not Discord locales (skipped in command localizations): ${nonDiscord.join(", ")}`,
		);
	}

	logger.info(`I18n initialized with ${languages.length} languages.`);
}

/**
 * Global translation function (Selector API).
 * Missing translations in a language fall back to `en-US`.
 *
 * Typed with our own `TKey` instead of i18next's native types: this is the single
 * cast of the module, and it keeps dynamic calls (selectors stored in variables,
 * like `command.description.content`) compiling.
 *
 * @example
 * t($ => $.commands.ping.description)
 * t($ => $.commands.ping.requested_by, { lng: "pt-BR", author: "Foo" })
 */
export const t = i18next.t.bind(i18next) as unknown as (key: TKey, options?: TOptions) => string;

/** Returns all registered languages except i18next's internal `cimode`. */
export function getSupportedLanguages(): string[] {
	return ((i18next.options.supportedLngs as string[]) || []).filter((l) => l !== "cimode");
}

/** Languages that are loaded by i18next and also accepted by Discord. */
function getDiscordLanguages(): string[] {
	return getSupportedLanguages().filter((lng) => DISCORD_LOCALES.has(lng));
}

/**
 * Converts text to a valid Discord name: lowercase, kebab-case, `[a-z0-9_-]`, max 32 chars.
 * Returns an empty string if nothing valid is left.
 */
export function sanitizeName(raw: string): string {
	return raw
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9_-]/g, "")
		.slice(0, MAX_NAME_LENGTH);
}

/**
 * Checks that a lookup produced real text: not an object, not empty and not a missing key.
 *
 * Without the key string we can't compare `val !== key`, so a missing key is detected by
 * its shape (the dotted path i18next returns when the key doesn't exist in any language).
 */
function isValidTranslation(val: unknown): val is string {
	if (typeof val !== "string") return false;

	const text = val.trim();
	if (!text) return false;
	if (text.includes("returned an object")) return false;
	if (KEY_PATH_PATTERN.test(text)) return false;

	return true;
}

/** Translates a selector and returns `undefined` when the result is not valid text. */
function translateSafe(key: TKey, lng: string): string | undefined {
	const value: unknown = t(key, { lng });
	return isValidTranslation(value) ? value.trim() : undefined;
}

/**
 * Base (English) description sent to Discord.
 * Throws when the key is missing in `en-US`: Discord rejects empty descriptions,
 * and a broken key must not be deployed as if it were text.
 *
 * @example
 * resolveDescription($ => $.commands.ping.description)
 */
export function resolveDescription(key: TKey): string {
	const text = translateSafe(key, Locale.EnglishUS);
	if (!text) {
		throw new Error(`[i18n] Missing or invalid ${Locale.EnglishUS} translation for: ${key}`);
	}
	return text.slice(0, MAX_DESCRIPTION_LENGTH);
}

/**
 * Resolves a translation selector into a LocalizationMap for Discord API.
 * Handles Discord's strict naming conventions (lowercase, no spaces, length limits).
 * Languages with a missing/invalid translation are skipped: Discord then shows the default.
 *
 * @param key - Selector that points to the translated text (e.g. `$ => $.commands.ping.description`)
 * @param type - Target field: `name` or `description`
 *
 * @example
 * resolveLocalizations($ => $.commands.ping.description, "description")
 * resolveLocalizations($ => $.commands.ping.name, "name") // only if `name` exists in the JSON
 */
export function resolveLocalizations(key: TKey, type: LocaleSubKeys): LocalizationMap {
	const map: LocalizationMap = {};
	const isNameType = type === LOCALE_SUB_KEYS.name;

	for (const lang of getDiscordLanguages()) {
		const lng = lang as keyof LocalizationMap;
		const translated = translateSafe(key, lang);

		if (!translated) continue;

		/**
		 * Discord limitations
		 * `names` must be lowercase, kebab-case, max 32 chars
		 * `descriptions` max 100 chars
		 */
		if (isNameType) {
			const sanitized = sanitizeName(translated);
			if (sanitized) map[lng] = sanitized;
		} else {
			map[lng] = translated.slice(0, MAX_DESCRIPTION_LENGTH);
		}
	}

	return map;
}
