export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
/**
 * Allows support for TS 4.5's `exactOptionalPropertyTypes` option by ensuring a property present and undefined is valid
 * (since JSON.stringify ignores undefined properties)
 */
export declare type AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base> = {
    [K in keyof Base]: Base[K] extends Exclude<Base[K], undefined> ? Base[K] : Base[K] | undefined;
};
export declare type StrictPartial<Base> = AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Partial<Base>>;
export declare type StrictRequired<Base> = Required<{
    [K in keyof Base]: Exclude<Base[K], undefined>;
}>;
//# sourceMappingURL=internals.d.ts.map