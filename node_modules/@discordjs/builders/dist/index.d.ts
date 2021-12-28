import * as ow from 'ow';
import * as discord_api_types_v9 from 'discord-api-types/v9';
import { APIEmbedField, APIEmbed, APIEmbedThumbnail, APIEmbedImage, APIEmbedVideo, APIEmbedAuthor, APIEmbedProvider, APIEmbedFooter, ApplicationCommandOptionType, ChannelType, APIApplicationCommandChannelOptions, APIApplicationCommandOptionChoice, APIApplicationCommandSubCommandOptions, RESTPostAPIApplicationCommandsJSONBody, APIApplicationCommandOption, ApplicationCommandType } from 'discord-api-types/v9';
import { Snowflake } from 'discord-api-types/globals';
import { URL } from 'url';

declare const fieldNamePredicate: ow.StringPredicate;
declare const fieldValuePredicate: ow.StringPredicate;
declare const fieldInlinePredicate: ow.BooleanPredicate & ow.BasePredicate<boolean | undefined>;
declare const embedFieldPredicate: ow.ObjectPredicate<{
    name: string;
    value: string;
    inline: boolean | undefined;
}>;
declare const embedFieldsArrayPredicate: ow.ArrayPredicate<{
    name: string;
    value: string;
    inline: boolean | undefined;
}>;
declare function validateFieldLength(fields: APIEmbedField[], amountAdding: number): void;
declare const authorNamePredicate: ow.AnyPredicate<string | null>;
declare const urlPredicate: ow.AnyPredicate<string | null | undefined>;
declare const colorPredicate: ow.AnyPredicate<number | null>;
declare const descriptionPredicate: ow.AnyPredicate<string | null>;
declare const footerTextPredicate: ow.AnyPredicate<string | null>;
declare const timestampPredicate: ow.AnyPredicate<number | Date | null>;
declare const titlePredicate: ow.AnyPredicate<string | null>;

declare const Assertions$2_fieldNamePredicate: typeof fieldNamePredicate;
declare const Assertions$2_fieldValuePredicate: typeof fieldValuePredicate;
declare const Assertions$2_fieldInlinePredicate: typeof fieldInlinePredicate;
declare const Assertions$2_embedFieldPredicate: typeof embedFieldPredicate;
declare const Assertions$2_embedFieldsArrayPredicate: typeof embedFieldsArrayPredicate;
declare const Assertions$2_validateFieldLength: typeof validateFieldLength;
declare const Assertions$2_authorNamePredicate: typeof authorNamePredicate;
declare const Assertions$2_urlPredicate: typeof urlPredicate;
declare const Assertions$2_colorPredicate: typeof colorPredicate;
declare const Assertions$2_descriptionPredicate: typeof descriptionPredicate;
declare const Assertions$2_footerTextPredicate: typeof footerTextPredicate;
declare const Assertions$2_timestampPredicate: typeof timestampPredicate;
declare const Assertions$2_titlePredicate: typeof titlePredicate;
declare namespace Assertions$2 {
  export {
    Assertions$2_fieldNamePredicate as fieldNamePredicate,
    Assertions$2_fieldValuePredicate as fieldValuePredicate,
    Assertions$2_fieldInlinePredicate as fieldInlinePredicate,
    Assertions$2_embedFieldPredicate as embedFieldPredicate,
    Assertions$2_embedFieldsArrayPredicate as embedFieldsArrayPredicate,
    Assertions$2_validateFieldLength as validateFieldLength,
    Assertions$2_authorNamePredicate as authorNamePredicate,
    Assertions$2_urlPredicate as urlPredicate,
    Assertions$2_colorPredicate as colorPredicate,
    Assertions$2_descriptionPredicate as descriptionPredicate,
    Assertions$2_footerTextPredicate as footerTextPredicate,
    Assertions$2_timestampPredicate as timestampPredicate,
    Assertions$2_titlePredicate as titlePredicate,
  };
}

interface AuthorOptions {
    name: string;
    url?: string;
    iconURL?: string;
}
interface FooterOptions {
    text: string;
    iconURL?: string;
}
/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
declare class Embed implements APIEmbed {
    /**
     * An array of fields of this embed
     */
    fields: APIEmbedField[];
    /**
     * The embed title
     */
    title?: string;
    /**
     * The embed description
     */
    description?: string;
    /**
     * The embed url
     */
    url?: string;
    /**
     * The embed color
     */
    color?: number;
    /**
     * The timestamp of the embed in the ISO format
     */
    timestamp?: string;
    /**
     * The embed thumbnail data
     */
    thumbnail?: APIEmbedThumbnail;
    /**
     * The embed image data
     */
    image?: APIEmbedImage;
    /**
     * Received video data
     */
    video?: APIEmbedVideo;
    /**
     * The embed author data
     */
    author?: APIEmbedAuthor;
    /**
     * Received data about the embed provider
     */
    provider?: APIEmbedProvider;
    /**
     * The embed footer data
     */
    footer?: APIEmbedFooter;
    constructor(data?: APIEmbed);
    /**
     * The accumulated length for the embed title, description, fields, footer text, and author name
     */
    get length(): number;
    /**
     * Adds a field to the embed (max 25)
     *
     * @param field The field to add.
     */
    addField(field: APIEmbedField): this;
    /**
     * Adds fields to the embed (max 25)
     *
     * @param fields The fields to add
     */
    addFields(...fields: APIEmbedField[]): this;
    /**
     * Removes, replaces, or inserts fields in the embed (max 25)
     *
     * @param index The index to start at
     * @param deleteCount The number of fields to remove
     * @param fields The replacing field objects
     */
    spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this;
    /**
     * Sets the author of this embed
     *
     * @param options The options for the author
     */
    setAuthor(options: AuthorOptions | null): this;
    /**
     * Sets the color of this embed
     *
     * @param color The color of the embed
     */
    setColor(color: number | null): this;
    /**
     * Sets the description of this embed
     *
     * @param description The description
     */
    setDescription(description: string | null): this;
    /**
     * Sets the footer of this embed
     *
     * @param options The options for the footer
     */
    setFooter(options: FooterOptions | null): this;
    /**
     * Sets the image of this embed
     *
     * @param url The URL of the image
     */
    setImage(url: string | null): this;
    /**
     * Sets the thumbnail of this embed
     *
     * @param url The URL of the thumbnail
     */
    setThumbnail(url: string | null): this;
    /**
     * Sets the timestamp of this embed
     *
     * @param timestamp The timestamp or date
     */
    setTimestamp(timestamp?: number | Date | null): this;
    /**
     * Sets the title of this embed
     *
     * @param title The title
     */
    setTitle(title: string | null): this;
    /**
     * Sets the URL of this embed
     *
     * @param url The URL
     */
    setURL(url: string | null): this;
    /**
     * Transforms the embed to a plain object
     */
    toJSON(): APIEmbed;
    /**
     * Normalizes field input and resolves strings
     *
     * @param fields Fields to normalize
     */
    static normalizeFields(...fields: APIEmbedField[]): APIEmbedField[];
}

/**
 * Wraps the content inside a codeblock with no language
 *
 * @param content The content to wrap
 */
declare function codeBlock<C extends string>(content: C): `\`\`\`\n${C}\`\`\``;
/**
 * Wraps the content inside a codeblock with the specified language
 *
 * @param language The language for the codeblock
 * @param content The content to wrap
 */
declare function codeBlock<L extends string, C extends string>(language: L, content: C): `\`\`\`${L}\n${C}\`\`\``;
/**
 * Wraps the content inside \`backticks\`, which formats it as inline code
 *
 * @param content The content to wrap
 */
declare function inlineCode<C extends string>(content: C): `\`${C}\``;
/**
 * Formats the content into italic text
 *
 * @param content The content to wrap
 */
declare function italic<C extends string>(content: C): `_${C}_`;
/**
 * Formats the content into bold text
 *
 * @param content The content to wrap
 */
declare function bold<C extends string>(content: C): `**${C}**`;
/**
 * Formats the content into underscored text
 *
 * @param content The content to wrap
 */
declare function underscore<C extends string>(content: C): `__${C}__`;
/**
 * Formats the content into strike-through text
 *
 * @param content The content to wrap
 */
declare function strikethrough<C extends string>(content: C): `~~${C}~~`;
/**
 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content The content to wrap
 */
declare function quote<C extends string>(content: C): `> ${C}`;
/**
 * Formats the content into a block quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content The content to wrap
 */
declare function blockQuote<C extends string>(content: C): `>>> ${C}`;
/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url The URL to wrap
 */
declare function hideLinkEmbed<C extends string>(url: C): `<${C}>`;
/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url The URL to wrap
 */
declare function hideLinkEmbed(url: URL): `<${string}>`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 */
declare function hyperlink<C extends string>(content: C, url: URL): `[${C}](${string})`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 */
declare function hyperlink<C extends string, U extends string>(content: C, url: U): `[${C}](${U})`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 * @param title The title shown when hovering on the masked link
 */
declare function hyperlink<C extends string, T extends string>(content: C, url: URL, title: T): `[${C}](${string} "${T}")`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 * @param title The title shown when hovering on the masked link
 */
declare function hyperlink<C extends string, U extends string, T extends string>(content: C, url: U, title: T): `[${C}](${U} "${T}")`;
/**
 * Wraps the content inside spoiler (hidden text)
 *
 * @param content The content to wrap
 */
declare function spoiler<C extends string>(content: C): `||${C}||`;
/**
 * Formats a user ID into a user mention
 *
 * @param userId The user ID to format
 */
declare function userMention<C extends Snowflake>(userId: C): `<@${C}>`;
/**
 * Formats a user ID into a member-nickname mention
 *
 * @param memberId The user ID to format
 */
declare function memberNicknameMention<C extends Snowflake>(memberId: C): `<@!${C}>`;
/**
 * Formats a channel ID into a channel mention
 *
 * @param channelId The channel ID to format
 */
declare function channelMention<C extends Snowflake>(channelId: C): `<#${C}>`;
/**
 * Formats a role ID into a role mention
 *
 * @param roleId The role ID to format
 */
declare function roleMention<C extends Snowflake>(roleId: C): `<@&${C}>`;
/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId The emoji ID to format
 */
declare function formatEmoji<C extends Snowflake>(emojiId: C, animated?: false): `<:_:${C}>`;
/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId The emoji ID to format
 * @param animated Whether the emoji is animated or not. Defaults to `false`
 */
declare function formatEmoji<C extends Snowflake>(emojiId: C, animated?: true): `<a:_:${C}>`;
/**
 * Formats a date into a short date-time string
 *
 * @param date The date to format, defaults to the current time
 */
declare function time(date?: Date): `<t:${bigint}>`;
/**
 * Formats a date given a format style
 *
 * @param date The date to format
 * @param style The style to use
 */
declare function time<S extends TimestampStylesString>(date: Date, style: S): `<t:${bigint}:${S}>`;
/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds The time to format, represents an UNIX timestamp in seconds
 */
declare function time<C extends number>(seconds: C): `<t:${C}>`;
/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds The time to format, represents an UNIX timestamp in seconds
 * @param style The style to use
 */
declare function time<C extends number, S extends TimestampStylesString>(seconds: C, style: S): `<t:${C}:${S}>`;
/**
 * The [message formatting timestamp styles](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles) supported by Discord
 */
declare const TimestampStyles: {
    /**
     * Short time format, consisting of hours and minutes, e.g. 16:20
     */
    readonly ShortTime: "t";
    /**
     * Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30
     */
    readonly LongTime: "T";
    /**
     * Short date format, consisting of day, month, and year, e.g. 20/04/2021
     */
    readonly ShortDate: "d";
    /**
     * Long date format, consisting of day, month, and year, e.g. 20 April 2021
     */
    readonly LongDate: "D";
    /**
     * Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20
     */
    readonly ShortDateTime: "f";
    /**
     * Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20
     */
    readonly LongDateTime: "F";
    /**
     * Relative time format, consisting of a relative duration format, e.g. 2 months ago
     */
    readonly RelativeTime: "R";
};
/**
 * The possible values, see {@link TimestampStyles} for more information
 */
declare type TimestampStylesString = typeof TimestampStyles[keyof typeof TimestampStyles];
/**
 * An enum with all the available faces from Discord's native slash commands
 */
declare enum Faces {
    /**
     * ¯\\_(ツ)\\_/¯
     */
    Shrug = "\u00AF\\_(\u30C4)\\_/\u00AF",
    /**
     * (╯°□°）╯︵ ┻━┻
     */
    Tableflip = "(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B",
    /**
     * ┬─┬ ノ( ゜-゜ノ)
     */
    Unflip = "\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)"
}

declare class SlashCommandBooleanOption extends SlashCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Boolean;
    constructor();
}

declare abstract class ApplicationCommandOptionWithChannelTypesBase extends SlashCommandOptionBase implements ToAPIApplicationCommandOptions {
    channelTypes?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[];
    /**
     * Adds a channel type to this option
     *
     * @param channelType The type of channel to allow
     */
    addChannelType(channelType: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>): this;
    /**
     * Adds channel types to this option
     *
     * @param channelTypes The channel types to add
     */
    addChannelTypes(channelTypes: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[]): this;
    toJSON(): APIApplicationCommandChannelOptions;
}

declare class SlashCommandChannelOption extends ApplicationCommandOptionWithChannelTypesBase {
    readonly type: ApplicationCommandOptionType.Channel;
    constructor();
}

declare abstract class ApplicationCommandOptionWithChoicesBase<T extends string | number> extends SlashCommandOptionBase implements ToAPIApplicationCommandOptions {
    choices?: APIApplicationCommandOptionChoice[];
    /**
     * Adds a choice for this option
     *
     * @param name The name of the choice
     * @param value The value of the choice
     */
    addChoice(name: string, value: T): this;
    /**
     * Adds multiple choices for this option
     *
     * @param choices The choices to add
     */
    addChoices(choices: [name: string, value: T][]): this;
    toJSON(): {
        choices: APIApplicationCommandOptionChoice[] | undefined;
        type: ApplicationCommandOptionType.String | ApplicationCommandOptionType.Integer | ApplicationCommandOptionType.Number;
        name: string;
        description: string;
        default?: boolean | undefined;
        required?: boolean | undefined;
    } | {
        choices: APIApplicationCommandOptionChoice[] | undefined;
        type: ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup;
        options?: discord_api_types_v9.APIApplicationCommandOption[] | undefined;
        name: string;
        description: string;
        default?: boolean | undefined;
        required?: boolean | undefined;
    } | {
        choices: APIApplicationCommandOptionChoice[] | undefined;
        type: ApplicationCommandOptionType.Channel;
        channel_types?: (discord_api_types_v9.ChannelType.GuildText | discord_api_types_v9.ChannelType.GuildVoice | discord_api_types_v9.ChannelType.GuildCategory | discord_api_types_v9.ChannelType.GuildNews | discord_api_types_v9.ChannelType.GuildStore | discord_api_types_v9.ChannelType.GuildNewsThread | discord_api_types_v9.ChannelType.GuildPublicThread | discord_api_types_v9.ChannelType.GuildPrivateThread | discord_api_types_v9.ChannelType.GuildStageVoice)[] | undefined;
        name: string;
        description: string;
        default?: boolean | undefined;
        required?: boolean | undefined;
    } | {
        choices: APIApplicationCommandOptionChoice[] | undefined;
        type: ApplicationCommandOptionType.Boolean | ApplicationCommandOptionType.User | ApplicationCommandOptionType.Role | ApplicationCommandOptionType.Mentionable;
        name: string;
        description: string;
        default?: boolean | undefined;
        required?: boolean | undefined;
    };
}

declare class SlashCommandIntegerOption extends ApplicationCommandOptionWithChoicesBase<number> {
    readonly type: ApplicationCommandOptionType.Integer;
    constructor();
}

declare class SlashCommandMentionableOption extends SlashCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Mentionable;
    constructor();
}

declare class SlashCommandNumberOption extends ApplicationCommandOptionWithChoicesBase<number> {
    readonly type: ApplicationCommandOptionType.Number;
    constructor();
}

declare class SlashCommandRoleOption extends SlashCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Role;
    constructor();
}

declare class SlashCommandStringOption extends ApplicationCommandOptionWithChoicesBase<string> {
    readonly type: ApplicationCommandOptionType.String;
    constructor();
}

declare class SlashCommandUserOption extends SlashCommandOptionBase {
    readonly type: ApplicationCommandOptionType.User;
    constructor();
}

declare class SharedSlashCommandOptions<ShouldOmitSubcommandFunctions = true> {
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Adds a boolean option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addBooleanOption(input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a user option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a channel option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addChannelOption(input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a role option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a mentionable option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addMentionableOption(input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a string option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addStringOption(input: SlashCommandStringOption | ((builder: SlashCommandStringOption) => SlashCommandStringOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds an integer option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addIntegerOption(input: SlashCommandIntegerOption | ((builder: SlashCommandIntegerOption) => SlashCommandIntegerOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a number option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addNumberOption(input: SlashCommandNumberOption | ((builder: SlashCommandNumberOption) => SlashCommandNumberOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    private _sharedAddOptionMethod;
}

declare class SharedNameAndDescription {
    readonly name: string;
    readonly description: string;
    /**
     * Sets the name
     *
     * @param name The name
     */
    setName(name: string): this;
    /**
     * Sets the description
     *
     * @param description The description
     */
    setDescription(description: string): this;
}

/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
declare class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand group
     */
    readonly name: string;
    /**
     * The description of this subcommand group
     */
    readonly description: string;
    /**
     * The subcommands part of this subcommand group
     */
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Adds a new subcommand to this group
     *
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): this;
    toJSON(): APIApplicationCommandSubCommandOptions;
}
interface SlashCommandSubcommandGroupBuilder extends SharedNameAndDescription {
}
/**
 * Represents a subcommand
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
declare class SlashCommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand
     */
    readonly name: string;
    /**
     * The description of this subcommand
     */
    readonly description: string;
    /**
     * The options of this subcommand
     */
    readonly options: ToAPIApplicationCommandOptions[];
    toJSON(): APIApplicationCommandSubCommandOptions;
}
interface SlashCommandSubcommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions<false> {
}

declare class SlashCommandBuilder {
    /**
     * The name of this slash command
     */
    readonly name: string;
    /**
     * The description of this slash command
     */
    readonly description: string;
    /**
     * The options of this slash command
     */
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * @default true
     */
    readonly defaultPermission: boolean | undefined;
    /**
     * Returns the final data that should be sent to Discord.
     *
     * **Note:** Calling this function will validate required properties based on their conditions.
     */
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
    /**
     * Sets whether the command is enabled by default when the application is added to a guild.
     *
     * **Note**: If set to `false`, you will have to later `PUT` the permissions for this command.
     *
     * @param value Whether or not to enable this command by default
     *
     * @see https://discord.com/developers/docs/interactions/application-commands#permissions
     */
    setDefaultPermission(value: boolean): this;
    /**
     * Adds a new subcommand group to this command
     *
     * @param input A function that returns a subcommand group builder, or an already built builder
     */
    addSubcommandGroup(input: SlashCommandSubcommandGroupBuilder | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)): SlashCommandSubcommandsOnlyBuilder;
    /**
     * Adds a new subcommand to this command
     *
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): SlashCommandSubcommandsOnlyBuilder;
}
interface SlashCommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions {
}
interface SlashCommandSubcommandsOnlyBuilder extends SharedNameAndDescription, Pick<SlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup'> {
}
interface SlashCommandOptionsOnlyBuilder extends SharedNameAndDescription, SharedSlashCommandOptions, Pick<SlashCommandBuilder, 'toJSON'> {
}
interface ToAPIApplicationCommandOptions {
    toJSON(): APIApplicationCommandOption;
}

declare class SlashCommandOptionBase extends SharedNameAndDescription implements ToAPIApplicationCommandOptions {
    required: boolean;
    readonly type: ApplicationCommandOptionType;
    constructor(type: ApplicationCommandOptionType);
    /**
     * Marks the option as required
     *
     * @param required If this option should be required
     */
    setRequired(required: boolean): this;
    toJSON(): APIApplicationCommandOption;
}

declare function validateRequiredParameters$1(name: string, description: string, options: ToAPIApplicationCommandOptions[]): void;
declare function validateName$1(name: unknown): asserts name is string;
declare function validateDescription(description: unknown): asserts description is string;
declare function validateDefaultPermission$1(value: unknown): asserts value is boolean;
declare function validateMaxOptionsLength(options: unknown): asserts options is ToAPIApplicationCommandOptions[];
declare function validateMaxChoicesLength(choices: APIApplicationCommandOptionChoice[]): void;
declare function assertReturnOfBuilder<T extends SlashCommandOptionBase | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder>(input: unknown, ExpectedInstanceOf: new () => T): asserts input is T;

declare const Assertions$1_validateDescription: typeof validateDescription;
declare const Assertions$1_validateMaxOptionsLength: typeof validateMaxOptionsLength;
declare const Assertions$1_validateMaxChoicesLength: typeof validateMaxChoicesLength;
declare const Assertions$1_assertReturnOfBuilder: typeof assertReturnOfBuilder;
declare namespace Assertions$1 {
  export {
    validateRequiredParameters$1 as validateRequiredParameters,
    validateName$1 as validateName,
    Assertions$1_validateDescription as validateDescription,
    validateDefaultPermission$1 as validateDefaultPermission,
    Assertions$1_validateMaxOptionsLength as validateMaxOptionsLength,
    Assertions$1_validateMaxChoicesLength as validateMaxChoicesLength,
    Assertions$1_assertReturnOfBuilder as assertReturnOfBuilder,
  };
}

declare class ContextMenuCommandBuilder {
    /**
     * The name of this context menu command
     */
    readonly name: string;
    /**
     * The type of this context menu command
     */
    readonly type: ContextMenuCommandType;
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * @default true
     */
    readonly defaultPermission: boolean | undefined;
    /**
     * Sets the name
     *
     * @param name The name
     */
    setName(name: string): this;
    /**
     * Sets the type
     *
     * @param type The type
     */
    setType(type: ContextMenuCommandType): this;
    /**
     * Sets whether the command is enabled by default when the application is added to a guild.
     *
     * **Note**: If set to `false`, you will have to later `PUT` the permissions for this command.
     *
     * @param value Whether or not to enable this command by default
     *
     * @see https://discord.com/developers/docs/interactions/application-commands#permissions
     */
    setDefaultPermission(value: boolean): this;
    /**
     * Returns the final data that should be sent to Discord.
     *
     * **Note:** Calling this function will validate required properties based on their conditions.
     */
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
declare type ContextMenuCommandType = ApplicationCommandType.User | ApplicationCommandType.Message;

declare function validateRequiredParameters(name: string, type: number): void;
declare function validateName(name: unknown): asserts name is string;
declare function validateType(type: unknown): asserts type is ContextMenuCommandType;
declare function validateDefaultPermission(value: unknown): asserts value is boolean;

declare const Assertions_validateRequiredParameters: typeof validateRequiredParameters;
declare const Assertions_validateName: typeof validateName;
declare const Assertions_validateType: typeof validateType;
declare const Assertions_validateDefaultPermission: typeof validateDefaultPermission;
declare namespace Assertions {
  export {
    Assertions_validateRequiredParameters as validateRequiredParameters,
    Assertions_validateName as validateName,
    Assertions_validateType as validateType,
    Assertions_validateDefaultPermission as validateDefaultPermission,
  };
}

export { AuthorOptions, Assertions as ContextMenuCommandAssertions, ContextMenuCommandBuilder, ContextMenuCommandType, Embed, Assertions$2 as EmbedAssertions, Faces, FooterOptions, Assertions$1 as SlashCommandAssertions, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandOptionsOnlyBuilder, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandUserOption, TimestampStyles, TimestampStylesString, ToAPIApplicationCommandOptions, blockQuote, bold, channelMention, codeBlock, formatEmoji, hideLinkEmbed, hyperlink, inlineCode, italic, memberNicknameMention, quote, roleMention, spoiler, strikethrough, time, underscore, userMention };
