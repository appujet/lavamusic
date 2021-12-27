import { BasePredicate } from './base-predicate';
import { Predicate, PredicateOptions } from './predicate';
export declare class ArrayPredicate<T = unknown> extends Predicate<T[]> {
    /**
    @hidden
    */
    constructor(options?: PredicateOptions);
    /**
    Test an array to have a specific length.

    @param length - The length of the array.
    */
    length(length: number): this;
    /**
    Test an array to have a minimum length.

    @param length - The minimum length of the array.
    */
    minLength(length: number): this;
    /**
    Test an array to have a maximum length.

    @param length - The maximum length of the array.
    */
    maxLength(length: number): this;
    /**
    Test an array to start with a specific value. The value is tested by identity, not structure.

    @param searchElement - The value that should be the start of the array.
    */
    startsWith(searchElement: T): this;
    /**
    Test an array to end with a specific value. The value is tested by identity, not structure.

    @param searchElement - The value that should be the end of the array.
    */
    endsWith(searchElement: T): this;
    /**
    Test an array to include all the provided elements. The values are tested by identity, not structure.

    @param searchElements - The values that should be included in the array.
    */
    includes(...searchElements: readonly T[]): this;
    /**
    Test an array to include any of the provided elements. The values are tested by identity, not structure.

    @param searchElements - The values that should be included in the array.
    */
    includesAny(...searchElements: readonly T[]): this;
    /**
    Test an array to be empty.
    */
    get empty(): this;
    /**
    Test an array to be not empty.
    */
    get nonEmpty(): this;
    /**
    Test an array to be deeply equal to the provided array.

    @param expected - Expected value to match.
    */
    deepEqual(expected: readonly T[]): this;
    /**
    Test all elements in the array to match to provided predicate.

    @param predicate - The predicate that should be applied against every individual item.

    @example
    ```
    ow(['a', 1], ow.array.ofType(ow.any(ow.string, ow.number)));
    ```
    */
    ofType<U extends T>(predicate: BasePredicate<U>): ArrayPredicate<U>;
    /**
    Test if the elements in the array exactly matches the elements placed at the same indices in the predicates array.

    @param predicates - Predicates to test the array against. Describes what the tested array should look like.

    @example
    ```
    ow(['1', 2], ow.array.exactShape([ow.string, ow.number]));
    ```
    */
    exactShape(predicates: Predicate[]): this;
}
