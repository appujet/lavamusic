/**
 * Types extracted from https://discord.com/developers/docs/resources/user
 */
import type { Snowflake } from '../../globals';
import type { APIGuildIntegration } from './guild';
/**
 * https://discord.com/developers/docs/resources/user#user-object
 */
export interface APIUser {
    /**
     * The user's id
     */
    id: Snowflake;
    /**
     * The user's username, not unique across the platform
     */
    username: string;
    /**
     * The user's 4-digit discord-tag
     */
    discriminator: string;
    /**
     * The user's avatar hash
     *
     * See https://discord.com/developers/docs/reference#image-formatting
     */
    avatar: string | null;
    /**
     * Whether the user belongs to an OAuth2 application
     */
    bot?: boolean;
    /**
     * Whether the user is an Official Discord System user (part of the urgent message system)
     */
    system?: boolean;
    /**
     * Whether the user has two factor enabled on their account
     */
    mfa_enabled?: boolean;
    /**
     * The user's banner hash
     *
     * See https://discord.com/developers/docs/reference#image-formatting
     */
    banner?: string | null;
    /**
     * The user's banner color encoded as an integer representation of hexadecimal color code
     */
    accent_color?: number | null;
    /**
     * The user's chosen language option
     */
    locale?: string;
    /**
     * Whether the email on this account has been verified
     */
    verified?: boolean;
    /**
     * The user's email
     */
    email?: string | null;
    /**
     * The flags on a user's account
     *
     * See https://discord.com/developers/docs/resources/user#user-object-user-flags
     */
    flags?: UserFlags;
    /**
     * The type of Nitro subscription on a user's account
     *
     * See https://discord.com/developers/docs/resources/user#user-object-premium-types
     */
    premium_type?: UserPremiumType;
    /**
     * The public flags on a user's account
     *
     * See https://discord.com/developers/docs/resources/user#user-object-user-flags
     */
    public_flags?: UserFlags;
}
/**
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
export declare const enum UserFlags {
    None = 0,
    DiscordEmployee = 1,
    PartneredServerOwner = 2,
    DiscordHypeSquadEvents = 4,
    BugHunterLevel1 = 8,
    HypeSquadHouseBravery = 64,
    HypeSquadHouseBrilliance = 128,
    HypeSquadHouseBalance = 256,
    EarlySupporter = 512,
    TeamUser = 1024,
    BugHunterLevel2 = 16384,
    VerifiedBot = 65536,
    EarlyVerifiedBotDeveloper = 131072,
    DiscordCertifiedModerator = 262144
}
/**
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
export declare const enum UserPremiumType {
    None = 0,
    NitroClassic = 1,
    Nitro = 2
}
/**
 * https://discord.com/developers/docs/resources/user#connection-object
 */
export interface APIConnection {
    /**
     * ID of the connection account
     */
    id: string;
    /**
     * The username of the connection account
     */
    name: string;
    /**
     * The service of the connection
     */
    type: string;
    /**
     * Whether the connection is revoked
     */
    revoked?: boolean;
    /**
     * An array of partial server integrations
     *
     * See https://discord.com/developers/docs/resources/guild#integration-object
     */
    integrations?: Partial<APIGuildIntegration>[];
    /**
     * Whether the connection is verified
     */
    verified: boolean;
    /**
     * Whether friend sync is enabled for this connection
     */
    friend_sync: boolean;
    /**
     * Whether activities related to this connection will be shown in presence updates
     */
    show_activity: boolean;
    /**
     * Visibility of this connection
     *
     * See https://discord.com/developers/docs/resources/user#connection-object-visibility-types
     */
    visibility: ConnectionVisibility;
}
export declare const enum ConnectionVisibility {
    /**
     * Invisible to everyone except the user themselves
     */
    None = 0,
    /**
     * Visible to everyone
     */
    Everyone = 1
}
//# sourceMappingURL=user.d.ts.map