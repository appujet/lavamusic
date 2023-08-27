import { User } from "@prisma/client";

export type UserDetails = {
    userId: string;
    accessToken: string;
    refreshToken: string;
    username: string;
    avatar: string;
    discriminator: string;
};

export type UpdateUserDetails = {
    accessToken: string;
    refreshToken: string;
    username: string;
    discriminator: string;
};

export type PartialGuild = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
};

export type PartialGuildChannel = {
    id: string;
    last_message_id: string;
    type: number;
    name: string;
    position: number;
    parent_id?: string;
    topic?: string;
    guild_id: string;
    permission_overwrites: string[];
    nsfw: boolean;
    rate_limit_per_user: string;
    banner?: string;
};


export type DiscordUserType = {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
};


export type Done = (err: Error, user: User) => void;

