import "i18next";

import type buttons from "../../locales/en-US/buttons.json";
import type commands from "../../locales/en-US/commands.json";
import type common from "../../locales/en-US/common.json";
import type dev from "../../locales/en-US/dev.json";
import type events from "../../locales/en-US/events.json";
import type player from "../../locales/en-US/player.json";

/**
 * Shape of the translation tree.
 *
 * Each top-level key is a JSON file name in `locales/<lang>/` (e.g. `commands.json`
 * becomes `$.commands`). The English files are the single source of truth: adding a
 * key there makes it available (and type-checked) everywhere, with no extra work.
 *
 * ⚠️ Keep this in sync with the files that exist in `locales/en-US`.
 * When you add a new JSON file, import it here and add it below.
 */
export interface I18nResourceSchema {
	buttons: typeof buttons;
	commands: typeof commands;
	common: typeof common;
	dev: typeof dev;
	events: typeof events;
	player: typeof player;
}

declare module "i18next" {
	interface CustomTypeOptions {
		/** Enables the typed Selector API: `t($ => $.commands.ping.description)`. */
		enableSelector: true;
		/** All JSON files are merged into this single namespace (see `I18n.ts`). */
		defaultNS: "translation";
		resources: { translation: I18nResourceSchema };
	}
}
