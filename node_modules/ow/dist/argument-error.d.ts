/**
@hidden
*/
export declare class ArgumentError extends Error {
    readonly validationErrors: ReadonlyMap<string, Set<string>>;
    constructor(message: string, context: Function, errors?: Map<string, Set<string>>);
}
