import type { APIMessageComponentDMInteraction, APIMessageComponentGuildInteraction, APIMessageComponentInteraction } from './_interactions/messageComponents';
import type { APIPingInteraction } from './_interactions/ping';
import type { APIApplicationCommandDMInteraction, APIApplicationCommandGuildInteraction, APIApplicationCommandInteraction } from './_interactions/applicationCommands';
import type { APIApplicationCommandAutocompleteInteraction } from './_interactions/autocomplete';
export * from './_interactions/base';
export * from './_interactions/messageComponents';
export * from './_interactions/ping';
export * from './_interactions/responses';
export * from './_interactions/applicationCommands';
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIInteraction = APIPingInteraction | APIApplicationCommandInteraction | APIMessageComponentInteraction | APIApplicationCommandAutocompleteInteraction;
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIDMInteraction = APIApplicationCommandDMInteraction | APIMessageComponentDMInteraction;
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
export declare type APIGuildInteraction = APIApplicationCommandGuildInteraction | APIMessageComponentGuildInteraction;
//# sourceMappingURL=interactions.d.ts.map