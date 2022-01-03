import type { APIApplicationCommandOptionChoice, ApplicationCommandOptionType } from './shared';
export interface APIApplicationCommandOptionBase<Type extends ApplicationCommandOptionType> {
    type: Type;
    name: string;
    description: string;
    required?: boolean;
}
export interface APIInteractionDataOptionBase<T extends ApplicationCommandOptionType, D> {
    name: string;
    type: T;
    value: D;
}
export declare type APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper<Base extends APIApplicationCommandOptionBase<ApplicationCommandOptionType>, ChoiceType extends APIApplicationCommandOptionChoice> = (Base & {
    autocomplete: true;
}) | (Base & {
    autocomplete?: false;
    choices?: ChoiceType[];
});
//# sourceMappingURL=base.d.ts.map