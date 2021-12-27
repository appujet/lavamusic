import type { ComponentType } from '../channel';
import type { APIBaseInteraction, InteractionType } from '../interactions';
import type { APIDMInteractionWrapper, APIGuildInteractionWrapper } from './base';
export declare type APIMessageComponentInteraction = APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData> & Required<Pick<APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData>, 'channel_id' | 'data' | 'message'>>;
export declare type APIMessageComponentInteractionData = APIMessageButtonInteractionData | APIMessageSelectMenuInteractionData;
export interface APIMessageComponentBaseInteractionData<CType extends ComponentType> {
    /**
     * The `custom_id` of the component
     */
    custom_id: string;
    /**
     * The type of the component
     */
    component_type: CType;
}
export declare type APIMessageButtonInteractionData = APIMessageComponentBaseInteractionData<ComponentType.Button>;
export interface APIMessageSelectMenuInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.SelectMenu> {
    values: string[];
}
export declare type APIMessageComponentDMInteraction = APIDMInteractionWrapper<APIMessageComponentInteraction>;
export declare type APIMessageComponentGuildInteraction = APIGuildInteractionWrapper<APIMessageComponentInteraction>;
//# sourceMappingURL=messageComponents.d.ts.map