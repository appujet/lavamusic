/**
 * Types extracted from https://discord.com/developers/docs/topics/permissions
 */
import type { Permissions, Snowflake } from '../../globals';
/**
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 *
 * These flags are exported as `BigInt`s and NOT numbers. Wrapping them in `Number()`
 * may cause issues, try to use BigInts as much as possible or modules that can
 * replicate them in some way
 */
export declare const PermissionFlagsBits: {
    readonly CreateInstantInvite: bigint;
    readonly KickMembers: bigint;
    readonly BanMembers: bigint;
    readonly Administrator: bigint;
    readonly ManageChannels: bigint;
    readonly ManageGuild: bigint;
    readonly AddReactions: bigint;
    readonly ViewAuditLog: bigint;
    readonly PrioritySpeaker: bigint;
    readonly Stream: bigint;
    readonly ViewChannel: bigint;
    readonly SendMessages: bigint;
    readonly SendTTSMessages: bigint;
    readonly ManageMessages: bigint;
    readonly EmbedLinks: bigint;
    readonly AttachFiles: bigint;
    readonly ReadMessageHistory: bigint;
    readonly MentionEveryone: bigint;
    readonly UseExternalEmojis: bigint;
    readonly ViewGuildInsights: bigint;
    readonly Connect: bigint;
    readonly Speak: bigint;
    readonly MuteMembers: bigint;
    readonly DeafenMembers: bigint;
    readonly MoveMembers: bigint;
    readonly UseVAD: bigint;
    readonly ChangeNickname: bigint;
    readonly ManageNicknames: bigint;
    readonly ManageRoles: bigint;
    readonly ManageWebhooks: bigint;
    readonly ManageEmojisAndStickers: bigint;
    readonly UseApplicationCommands: bigint;
    readonly RequestToSpeak: bigint;
    readonly UseExternalStickers: bigint;
    readonly StartEmbeddedActivities: bigint;
};
/**
 * https://discord.com/developers/docs/topics/permissions#role-object
 */
export interface APIRole {
    /**
     * Role id
     */
    id: Snowflake;
    /**
     * Role name
     */
    name: string;
    /**
     * Integer representation of hexadecimal color code
     */
    color: number;
    /**
     * If this role is pinned in the user listing
     */
    hoist: boolean;
    /**
     * The role icon hash
     */
    icon?: string | null;
    /**
     * The role unicode emoji as a standard emoji
     */
    unicode_emoji?: string | null;
    /**
     * Position of this role
     */
    position: number;
    /**
     * Permission bit set
     *
     * See https://en.wikipedia.org/wiki/Bit_field
     */
    permissions: Permissions;
    /**
     * Whether this role is managed by an integration
     */
    managed: boolean;
    /**
     * Whether this role is mentionable
     */
    mentionable: boolean;
    /**
     * The tags this role has
     */
    tags?: APIRoleTags;
}
/**
 * https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
 */
export interface APIRoleTags {
    /**
     * The id of the bot this role belongs to
     */
    bot_id?: Snowflake;
    /**
     * Whether this is the guild's premium subscriber role
     */
    premium_subscriber?: null;
    /**
     * The id of the integration this role belongs to
     */
    integration_id?: Snowflake;
}
//# sourceMappingURL=permissions.d.ts.map