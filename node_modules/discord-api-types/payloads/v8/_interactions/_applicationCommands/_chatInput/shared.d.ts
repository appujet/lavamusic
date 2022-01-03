/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export declare const enum ApplicationCommandOptionType {
    Subcommand = 1,
    SubcommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10
}
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure
 */
export interface APIApplicationCommandOptionChoice<ValueType = string | number> {
    name: string;
    value: ValueType;
}
//# sourceMappingURL=shared.d.ts.map