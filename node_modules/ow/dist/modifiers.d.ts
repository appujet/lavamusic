import { BasePredicate } from '.';
import { Predicates } from './predicates';
declare type Optionalify<P> = P extends BasePredicate<infer X> ? P & BasePredicate<X | undefined> : P;
export interface Modifiers {
    /**
    Make the following predicate optional so it doesn't fail when the value is `undefined`.
    */
    readonly optional: {
        [K in keyof Predicates]: Optionalify<Predicates[K]>;
    };
}
declare const _default: <T>(object: T) => T & Modifiers;
export default _default;
