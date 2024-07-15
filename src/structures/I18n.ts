
import i18n from "i18n";

import Logger from "./Logger.js";
import { Locale } from "discord.js";

const logger = new Logger();

export function initI18n() {
    i18n.configure({
        locales: [
            Locale.EnglishUS,
            Locale.Hindi
        ],
        defaultLocale: Locale.EnglishUS,
        directory: `${process.cwd()}/languages/locales`,
        retryInDefaultLocale: true,
        objectNotation: true,
        register: global,
        logWarnFn: console.warn,
        logErrorFn: console.error,
        missingKeyFn: (_locale, value) => {
            return value;
        },
        mustacheConfig: {
            tags: ["{", "}"],
            disable: false
        }
    });

    logger.info("I18n has been initialized");
}

export { i18n };

export function T(locale: string, text: string | i18n.TranslateOptions, ...params: any) {
    i18n.setLocale(locale);
    return i18n.__(text, ...params);
}