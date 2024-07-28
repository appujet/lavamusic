import { Command, type Context, type Lavamusic } from "../../structures/index.js";
import { Language } from "../../types.js";
export const LocaleFlags = {
    [Language.Indonesian]: "🇮🇩",
    [Language.EnglishUS]: "🇺🇸",
    [Language.EnglishGB]: "🇬🇧",
    [Language.Bulgarian]: "🇧🇬",
    [Language.ChineseCN]: "🇨🇳",
    [Language.ChineseTW]: "🇹🇼",
    [Language.Croatian]: "🇭🇷",
    [Language.Czech]: "🇨🇿",
    [Language.Danish]: "🇩🇰",
    [Language.Dutch]: "🇳🇱",
    [Language.Finnish]: "🇫🇮",
    [Language.French]: "🇫🇷",
    [Language.German]: "🇩🇪",
    [Language.Greek]: "🇬🇷",
    [Language.Hindi]: "🇮🇳",
    [Language.Hungarian]: "🇭🇺",
    [Language.Italian]: "🇮🇹",
    [Language.Japanese]: "🇯🇵",
    [Language.Korean]: "🇰🇷",
    [Language.Lithuanian]: "🇱🇹",
    [Language.Norwegian]: "🇳🇴",
    [Language.Polish]: "🇵🇱",
    [Language.PortugueseBR]: "🇧🇷",
    [Language.Romanian]: "🇷🇴",
    [Language.Russian]: "🇷🇺",
    [Language.SpanishES]: "🇪🇸",
    [Language.Swedish]: "🇸🇪",
    [Language.Thai]: "🇹🇭",
    [Language.Turkish]: "🇹🇷",
    [Language.Ukrainian]: "🇺🇦",
    [Language.Vietnamese]: "🇻🇳",
};
export default class LanguageCommand extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "language",
            description: {
                content: "cmd.language.description",
                examples: ["language set en", "language reset"],
                usage: "language",
            },
            category: "general",
            aliases: ["language", "lang"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "cmd.language.options.set",
                    type: 1,
                    options: [
                        {
                            name: "language",
                            description: "cmd.language.options.language",
                            type: 3,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "reset",
                    description: "cmd.language.options.reset",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let subCommand: string;

        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
        } else {
            subCommand = args.shift();
        }

        if (subCommand === "set") {
            const embed = client.embed().setColor(this.client.color.main);

            const locale = await client.db.getLanguage(ctx.guild!.id);

            let lang: string;

            if (ctx.isInteraction) {
                lang = ctx.interaction.options.data[0].options[0].value as string;
            } else {
                lang = args[0];
            }

            if (!Object.values(Language).includes(lang as Language)) {
                return ctx.sendMessage({
                    embeds: [
                        embed.setDescription(
                            ctx.locale("cmd.language.invalid_language", { languages: `\`${Object.values(Language).join("`, `")}\`` }),
                        ),
                    ],
                });
            }

            if (locale && locale === lang) {
                return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.already_set", { language: lang }))] });
            }

            await client.db.updateLanguage(ctx.guild!.id, lang);
            ctx.guildLocale = lang;
            const availableLanguages = Object.entries(LocaleFlags)
                .map(([key, value]) => `${value}:\`${key}\``)
                .join(", ");

            return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.set", { language: availableLanguages }))] });
        }
    }
}
