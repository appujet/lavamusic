import type { MessageFlags } from '../index';
import type { RESTPostAPIWebhookWithTokenJSONBody } from '../../../v8';
import type { APIApplicationCommandOptionChoice } from './applicationCommands';
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
 */
export declare const enum InteractionType {
    Ping = 1,
    ApplicationCommand = 2,
    MessageComponent = 3,
    ApplicationCommandAutocomplete = 4
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
 */
export declare type APIInteractionResponse = APIInteractionResponsePong | APIInteractionResponseChannelMessageWithSource | APIInteractionResponseDeferredChannelMessageWithSource | APIInteractionResponseDeferredMessageUpdate | APIInteractionResponseUpdateMessage | APIApplicationCommandAutocompleteResponse;
export interface APIInteractionResponsePong {
    type: InteractionResponseType.Pong;
}
export interface APIApplicationCommandAutocompleteResponse {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult;
    data: APICommandAutocompleteInteractionResponseCallbackData;
}
export interface APIInteractionResponseChannelMessageWithSource {
    type: InteractionResponseType.ChannelMessageWithSource;
    data: APIInteractionResponseCallbackData;
}
export interface APIInteractionResponseDeferredChannelMessageWithSource {
    type: InteractionResponseType.DeferredChannelMessageWithSource;
    data?: Pick<APIInteractionResponseCallbackData, 'flags'>;
}
export interface APIInteractionResponseDeferredMessageUpdate {
    type: InteractionResponseType.DeferredMessageUpdate;
}
export interface APIInteractionResponseUpdateMessage {
    type: InteractionResponseType.UpdateMessage;
    data?: APIInteractionResponseCallbackData;
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
export declare const enum InteractionResponseType {
    /**
     * ACK a `Ping`
     */
    Pong = 1,
    /**
     * Respond to an interaction with a message
     */
    ChannelMessageWithSource = 4,
    /**
     * ACK an interaction and edit to a response later, the user sees a loading state
     */
    DeferredChannelMessageWithSource = 5,
    /**
     * ACK a button interaction and update it to a loading state
     */
    DeferredMessageUpdate = 6,
    /**
     * ACK a button interaction and edit the message to which the button was attached
     */
    UpdateMessage = 7,
    /**
     * For autocomplete interactions
     */
    ApplicationCommandAutocompleteResult = 8
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure
 */
export declare type APIInteractionResponseCallbackData = Omit<RESTPostAPIWebhookWithTokenJSONBody, 'username' | 'avatar_url'> & {
    flags?: MessageFlags;
};
export interface APICommandAutocompleteInteractionResponseCallbackData {
    choices?: APIApplicationCommandOptionChoice[];
}
//# sourceMappingURL=responses.d.ts.map