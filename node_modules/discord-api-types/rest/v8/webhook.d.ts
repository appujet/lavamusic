import type { Snowflake } from '../../globals';
import type { APIAllowedMentions, APIActionRowComponent, APIEmbed, APIMessage, APIWebhook, APIAttachment } from '../../payloads/v8/index';
import type { Nullable } from '../../utils/internals';
/**
 * https://discord.com/developers/docs/resources/webhook#create-webhook
 */
export interface RESTPostAPIChannelWebhookJSONBody {
    /**
     * Name of the webhook (1-80 characters)
     */
    name: string;
    /**
     * Image for the default webhook avatar
     *
     * See https://discord.com/developers/docs/reference#image-data
     */
    avatar?: string | null;
}
/**
 * https://discord.com/developers/docs/resources/webhook#create-webhook
 */
export declare type RESTPostAPIChannelWebhookResult = APIWebhook;
/**
 * https://discord.com/developers/docs/resources/webhook#get-channel-webhooks
 */
export declare type RESTGetAPIChannelWebhooksResult = APIWebhook[];
/**
 * https://discord.com/developers/docs/resources/webhook#get-guild-webhooks
 */
export declare type RESTGetAPIGuildWebhooksResult = APIWebhook[];
/**
 * https://discord.com/developers/docs/resources/webhook#get-webhook
 */
export declare type RESTGetAPIWebhookResult = APIWebhook;
/**
 * https://discord.com/developers/docs/resources/webhook#get-webhook-with-token
 */
export declare type RESTGetAPIWebhookWithTokenResult = Omit<APIWebhook, 'user'>;
/**
 * https://discord.com/developers/docs/resources/webhook#modify-webhook
 */
export interface RESTPatchAPIWebhookJSONBody {
    /**
     * The default name of the webhook
     */
    name?: string;
    /**
     * Image for the default webhook avatar
     *
     * See https://discord.com/developers/docs/reference#image-data
     */
    avatar?: string | null;
    /**
     * The new channel id this webhook should be moved to
     */
    channel_id?: Snowflake;
}
/**
 * https://discord.com/developers/docs/resources/webhook#modify-webhook
 */
export declare type RESTPatchAPIWebhookResult = APIWebhook;
/**
 * https://discord.com/developers/docs/resources/webhook#modify-webhook-with-token
 */
export declare type RESTPatchAPIWebhookWithTokenJSONBody = Omit<RESTPatchAPIWebhookJSONBody, 'channel_id'>;
/**
 * https://discord.com/developers/docs/resources/webhook#modify-webhook-with-token
 */
export declare type RESTPatchAPIWebhookWithTokenResult = RESTGetAPIWebhookWithTokenResult;
/**
 * https://discord.com/developers/docs/resources/webhook#delete-webhook
 */
export declare type RESTDeleteAPIWebhookResult = never;
/**
 * https://discord.com/developers/docs/resources/webhook#delete-webhook-with-token
 */
export declare type RESTDeleteAPIWebhookWithTokenResult = never;
/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export interface RESTPostAPIWebhookWithTokenJSONBody {
    /**
     * The message contents (up to 2000 characters)
     */
    content?: string;
    /**
     * Override the default username of the webhook
     */
    username?: string;
    /**
     * Override the default avatar of the webhook
     */
    avatar_url?: string;
    /**
     * `true` if this is a TTS message
     */
    tts?: boolean;
    /**
     * Embedded `rich` content
     *
     * See https://discord.com/developers/docs/resources/channel#embed-object
     */
    embeds?: APIEmbed[];
    /**
     * Allowed mentions for the message
     *
     * See https://discord.com/developers/docs/resources/channel#allowed-mentions-object
     */
    allowed_mentions?: APIAllowedMentions;
    /**
     * The components to include with the message
     *
     * Requires an application-owned webhook
     *
     * See https://discord.com/developers/docs/interactions/message-components#component-object
     */
    components?: APIActionRowComponent[];
}
/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export declare type RESTPostAPIWebhookWithTokenFormDataBody = {
    /**
     * JSON stringified message body
     */
    payload_json?: string;
    /**
     * The file contents
     */
    file: unknown;
} | (RESTPostAPIWebhookWithTokenJSONBody & {
    /**
     * The file contents
     */
    file: unknown;
});
/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook-querystring-params
 */
export interface RESTPostAPIWebhookWithTokenQuery {
    /**
     * Waits for server confirmation of message send before response, and returns the created message body
     * (defaults to `false`; when `false` a message that is not saved does not return an error)
     *
     * @default false
     */
    wait?: boolean;
}
/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export declare type RESTPostAPIWebhookWithTokenResult = never;
/**
 * Received when a call to https://discord.com/developers/docs/resources/webhook#execute-webhook receives
 * the `wait` query parameter set to `true`
 *
 * See https://discord.com/developers/docs/resources/webhook#execute-webhook-querystring-params
 */
export declare type RESTPostAPIWebhookWithTokenWaitResult = APIMessage;
/**
 * https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook-querystring-params
 */
export declare type RESTPostAPIWebhookWithTokenSlackQuery = RESTPostAPIWebhookWithTokenQuery;
/**
 * https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook
 */
export declare type RESTPostAPIWebhookWithTokenSlackResult = never;
/**
 * Received when a call to https://discord.com/developers/docs/resources/webhook#execute-webhook receives
 * the `wait` query parameter set to `true`
 *
 * See https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook-querystring-params
 */
export declare type RESTPostAPIWebhookWithTokenSlackWaitResult = APIMessage;
/**
 * https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook-querystring-params
 */
export declare type RESTPostAPIWebhookWithTokenGitHubQuery = RESTPostAPIWebhookWithTokenQuery;
/**
 * https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook
 */
export declare type RESTPostAPIWebhookWithTokenGitHubResult = never;
/**
 * Received when a call to https://discord.com/developers/docs/resources/webhook#execute-webhook receives
 * the `wait` query parameter set to `true`
 *
 * See https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook-querystring-params
 */
export declare type RESTPostAPIWebhookWithTokenGitHubWaitResult = APIMessage;
/**
 * https://discord.com/developers/docs/resources/webhook#get-webhook-message
 */
export declare type RESTGetAPIWebhookWithTokenMessageResult = APIMessage;
/**
 * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
 */
export interface RESTPatchAPIWebhookWithTokenMessageJSONBody extends Nullable<Pick<RESTPostAPIWebhookWithTokenJSONBody, 'content' | 'embeds' | 'allowed_mentions' | 'components'>> {
    /**
     * Attached files to keep
     *
     * See https://discord.com/developers/docs/resources/channel#attachment-object
     */
    attachments?: APIAttachment[] | null;
}
/**
 * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
 */
export declare type RESTPatchAPIWebhookWithTokenMessageFormDataBody = {
    /**
     * JSON stringified message body
     */
    payload_json?: string;
    /**
     * The file contents
     */
    file: unknown;
} | (RESTPatchAPIWebhookWithTokenMessageJSONBody & {
    /**
     * The file contents
     */
    file: unknown;
});
/**
 * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
 */
export declare type RESTPatchAPIWebhookWithTokenMessageResult = APIMessage;
/**
 * https://discord.com/developers/docs/resources/webhook#delete-webhook-message
 */
export declare type RESTDeleteAPIWebhookWithTokenMessageResult = never;
//# sourceMappingURL=webhook.d.ts.map