import type { APIRole, APIUser, ChannelType } from '../../index';
import type { Snowflake } from '../../../../globals';
import type { APIDMInteractionWrapper, APIGuildInteractionWrapper } from '../base';
import type { APIApplicationCommandInteractionWrapper, APIInteractionDataResolvedChannel, APIInteractionDataResolvedGuildMember, ApplicationCommandType } from '../applicationCommands';
import type { APIBaseApplicationCommandInteractionData } from './internals';
interface APIApplicationCommandOptionBase {
    type: ApplicationCommandOptionType.Boolean | ApplicationCommandOptionType.User | ApplicationCommandOptionType.Role | ApplicationCommandOptionType.Mentionable;
    name: string;
    description: string;
    default?: boolean;
    required?: boolean;
}
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
export declare type APIApplicationCommandOption = APIApplicationCommandArgumentOptions | APIApplicationCommandSubCommandOptions | APIApplicationCommandChannelOptions | APIApplicationCommandOptionBase;
/**
 * This type is exported as a way to make it stricter for you when you're writing your commands
 *
 * If the option is a `SUB_COMMAND` or `SUB_COMMAND_GROUP` type, this nested options will be the parameters
 */
export interface APIApplicationCommandSubCommandOptions extends Omit<APIApplicationCommandOptionBase, 'type'> {
    type: ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup;
    options?: APIApplicationCommandOption[];
}
/**
 * This type is exported as a way to make it stricter for you when you're writing your commands
 *
 * In contrast to `APIApplicationCommandSubCommandOptions`, these types cannot have an `options` array,
 * but they can have a `choices` one
 */
export interface APIApplicationCommandArgumentOptions extends Omit<APIApplicationCommandOptionBase, 'type'> {
    type: ApplicationCommandOptionType.String | ApplicationCommandOptionType.Integer | ApplicationCommandOptionType.Number;
    choices?: APIApplicationCommandOptionChoice[];
}
/**
 * This type is exported as a way to make it stricter for you when you're writing your commands
 *
 * In contrast to `APIApplicationCommandSubCommandOptions` and `APIApplicationCommandArgumentOptions`,
 *  these types cannot have an `options` array, or a `choices` array, but they can have a `channel_types` one.
 */
export interface APIApplicationCommandChannelOptions extends Omit<APIApplicationCommandOptionBase, 'type'> {
    type: ApplicationCommandOptionType.Channel;
    channel_types?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[];
}
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
export interface APIApplicationCommandOptionChoice {
    name: string;
    value: string | number;
}
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-interaction-data-option-structure
 */
export declare type APIApplicationCommandInteractionDataOption = ApplicationCommandInteractionDataOptionSubCommand | ApplicationCommandInteractionDataOptionSubCommandGroup | APIApplicationCommandInteractionDataOptionWithValues;
export interface ApplicationCommandInteractionDataOptionSubCommand {
    name: string;
    type: ApplicationCommandOptionType.Subcommand;
    options: APIApplicationCommandInteractionDataOptionWithValues[];
}
export interface ApplicationCommandInteractionDataOptionSubCommandGroup {
    name: string;
    type: ApplicationCommandOptionType.SubcommandGroup;
    options: ApplicationCommandInteractionDataOptionSubCommand[];
}
export declare type APIApplicationCommandInteractionDataOptionWithValues = ApplicationCommandInteractionDataOptionString | ApplicationCommandInteractionDataOptionRole | ApplicationCommandInteractionDataOptionChannel | ApplicationCommandInteractionDataOptionUser | ApplicationCommandInteractionDataOptionMentionable | ApplicationCommandInteractionDataOptionInteger | ApplicationCommandInteractionDataOptionNumber | ApplicationCommandInteractionDataOptionBoolean;
export declare type ApplicationCommandInteractionDataOptionString = InteractionDataOptionBase<ApplicationCommandOptionType.String, string>;
export declare type ApplicationCommandInteractionDataOptionRole = InteractionDataOptionBase<ApplicationCommandOptionType.Role, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionChannel = InteractionDataOptionBase<ApplicationCommandOptionType.Channel, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionUser = InteractionDataOptionBase<ApplicationCommandOptionType.User, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionMentionable = InteractionDataOptionBase<ApplicationCommandOptionType.Mentionable, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionInteger = InteractionDataOptionBase<ApplicationCommandOptionType.Integer, number>;
export declare type ApplicationCommandInteractionDataOptionNumber = InteractionDataOptionBase<ApplicationCommandOptionType.Number, number>;
export declare type ApplicationCommandInteractionDataOptionBoolean = InteractionDataOptionBase<ApplicationCommandOptionType.Boolean, boolean>;
interface InteractionDataOptionBase<T extends ApplicationCommandOptionType, D = unknown> {
    name: string;
    type: T;
    value: D;
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure
 */
export interface APIChatInputApplicationCommandInteractionData extends APIBaseApplicationCommandInteractionData<ApplicationCommandType.ChatInput> {
    options?: APIApplicationCommandInteractionDataOption[];
    resolved?: APIChatInputApplicationCommandInteractionDataResolved;
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure
 */
export interface APIChatInputApplicationCommandInteractionDataResolved {
    users?: Record<Snowflake, APIUser>;
    roles?: Record<Snowflake, APIRole>;
    members?: Record<Snowflake, APIInteractionDataResolvedGuildMember>;
    channels?: Record<Snowflake, APIInteractionDataResolvedChannel>;
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIChatInputApplicationCommandInteraction = APIApplicationCommandInteractionWrapper<APIChatInputApplicationCommandInteractionData>;
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIChatInputApplicationCommandDMInteraction = APIDMInteractionWrapper<APIChatInputApplicationCommandInteraction>;
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIChatInputApplicationCommandGuildInteraction = APIGuildInteractionWrapper<APIChatInputApplicationCommandInteraction>;
export {};
//# sourceMappingURL=chatInput.d.ts.map