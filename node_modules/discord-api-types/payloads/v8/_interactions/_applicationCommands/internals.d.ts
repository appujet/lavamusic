import type { Snowflake } from '../../../../globals';
import type { ApplicationCommandType } from '../applicationCommands';
export interface APIBaseApplicationCommandInteractionData<Type extends ApplicationCommandType> {
    id: Snowflake;
    type: Type;
    name: string;
}
//# sourceMappingURL=internals.d.ts.map