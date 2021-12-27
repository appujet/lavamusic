import { BasePredicate } from '..';
export interface Shape {
    [key: string]: BasePredicate | Shape;
}
/**
Extracts a regular type from a shape definition.

@example
```
const myShape = {
    foo: ow.string,
    bar: {
        baz: ow.boolean
    }
}

type X = TypeOfShape<typeof myShape> // {foo: string; bar: {baz: boolean}}
```

This is used in the `ow.object.partialShape(…)` and `ow.object.exactShape(…)` functions.
*/
export declare type TypeOfShape<S extends BasePredicate | Shape> = S extends BasePredicate<infer X> ? X : S extends Shape ? {
    [K in keyof S]: TypeOfShape<S[K]>;
} : never;
/**
Test if the `object` matches the `shape` partially.

@hidden

@param object - Object to test against the provided shape.
@param shape - Shape to test the object against.
@param parent - Name of the parent property.
*/
export declare function partial(object: Record<string, any>, shape: Shape, parent?: string): boolean | string;
/**
Test if the `object` matches the `shape` exactly.

@hidden

@param object - Object to test against the provided shape.
@param shape - Shape to test the object against.
@param parent - Name of the parent property.
*/
export declare function exact(object: Record<string, any>, shape: Shape, parent?: string, isArray?: boolean): boolean | string;
