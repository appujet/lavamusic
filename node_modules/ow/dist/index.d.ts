import { Predicate } from './predicates/predicate';
import { BasePredicate } from './predicates/base-predicate';
import { Modifiers } from './modifiers';
import { Predicates } from './predicates';
/**
@hidden
*/
export declare type Main = <T>(value: T, label: string | Function, predicate: BasePredicate<T>, idLabel?: boolean) => void;
export interface Ow extends Modifiers, Predicates {
    /**
    Test if the value matches the predicate. Throws an `ArgumentError` if the test fails.

    @param value - Value to test.
    @param predicate - Predicate to test against.
    */
    <T>(value: unknown, predicate: BasePredicate<T>): asserts value is T;
    /**
    Test if `value` matches the provided `predicate`. Throws an `ArgumentError` with the specified `label` if the test fails.

    @param value - Value to test.
    @param label - Label which should be used in error messages.
    @param predicate - Predicate to test against.
    */
    <T>(value: unknown, label: string, predicate: BasePredicate<T>): asserts value is T;
    /**
    Returns `true` if the value matches the predicate, otherwise returns `false`.

    @param value - Value to test.
    @param predicate - Predicate to test against.
    */
    isValid: <T>(value: T, predicate: BasePredicate<T>) => value is T;
    /**
    Create a reusable validator.

    @param predicate - Predicate used in the validator function.
    */
    create: (<T>(predicate: BasePredicate<T>) => ReusableValidator<T>) & (<T>(label: string, predicate: BasePredicate<T>) => ReusableValidator<T>);
}
/**
A reusable validator.
*/
export interface ReusableValidator<T> {
    /**
    Test if the value matches the predicate. Throws an `ArgumentError` if the test fails.

    @param value - Value to test.
    @param label - Override the label which should be used in error messages.
    */
    (value: T, label?: string): void;
}
declare const _ow: Ow;
export default _ow;
export { BasePredicate, Predicate };
export * from './predicates';
export { ArgumentError } from './argument-error';
