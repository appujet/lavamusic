
export type Guilds = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: string[];
}

export type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    userId: string;
    guilds: Guilds[];
    accessToken: string;
    refreshToken: string;
}


export type Guild = {
    id: string;
    name: string;
    icon: string;
    description: string;
    home_header: string;
    splash: string;
    discovery_splash: string;
    features: string[];
    banner: string;
    owner_id: string;
    application_id: string;
    region: string;
    afk_channel_id: string;
    afk_timeout: number;
    system_channel_id: string;
    system_channel_flags: number;
    widget_enabled: boolean;
    widget_channel_id: string;
    verification_level: number;
    roles: Role[];
    default_message_notifications: number;
    mfa_level: number;
    explicit_content_filter: number;
    max_presences: number;
    max_members: number;
    max_stage_video_channel_users: number;
    max_video_channel_users: number;
    vanity_url_code: string;
    premium_tier: number;
    premium_subscription_count: number;
    preferred_locale: string;
    rules_channel_id: string;
    safety_alerts_channel_id: string;
    public_updates_channel_id: string;
    hub_type: string;
    premium_progress_bar_enabled: boolean;
    latest_onboarding_question_id: string;
    nsfw: boolean;
    nsfw_level: number;
    emojis: Emoji[];
    stickers: Sticker[];
    banner_background_color: string;
    banner_background_id: string;
    incidents_data: string;
    inventory_settings: string;
    embed_enabled: boolean;
    embed_channel_id: string;
    application_command_count: number;
    approximate_member_count: number;
    approximate_presence_count: number;
}

export type Role = {
    id: string;
    name: string;
    description: string;
    permissions: string;
    position: number;
    color: number;
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    icon: string;
    unicode_emoji: string;
    flags: number;
}

export type Emoji = {
    id: string;
    name: string;
    roles: string[];
    require_colons: boolean;
    managed: boolean;
    animated: boolean;
    available: boolean;
}

export type Sticker = {
    id: string;
    name: string;
    tags: string;
    type: number;
    format_type: number;
    description: string;
    asset: string;
    available: boolean;
    guild_id: string;
}
