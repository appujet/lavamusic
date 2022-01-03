import { ZodParsedType } from "./helpers/parseUtil";
import { util } from "./helpers/util";
export declare const ZodIssueCode: {
    invalid_type: "invalid_type";
    custom: "custom";
    invalid_union: "invalid_union";
    invalid_enum_value: "invalid_enum_value";
    unrecognized_keys: "unrecognized_keys";
    invalid_arguments: "invalid_arguments";
    invalid_return_type: "invalid_return_type";
    invalid_date: "invalid_date";
    invalid_string: "invalid_string";
    too_small: "too_small";
    too_big: "too_big";
    invalid_intersection_types: "invalid_intersection_types";
    not_multiple_of: "not_multiple_of";
};
export declare type ZodIssueCode = keyof typeof ZodIssueCode;
export declare type ZodIssueBase = {
    path: (string | number)[];
    message?: string;
};
export interface ZodInvalidTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_type;
    expected: ZodParsedType;
    received: ZodParsedType;
}
export interface ZodUnrecognizedKeysIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.unrecognized_keys;
    keys: string[];
}
export interface ZodInvalidUnionIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union;
    unionErrors: ZodError[];
}
export interface ZodInvalidEnumValueIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_enum_value;
    options: (string | number)[];
}
export interface ZodInvalidArgumentsIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_arguments;
    argumentsError: ZodError;
}
export interface ZodInvalidReturnTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_return_type;
    returnTypeError: ZodError;
}
export interface ZodInvalidDateIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_date;
}
export declare type StringValidation = "email" | "url" | "uuid" | "regex" | "cuid";
export interface ZodInvalidStringIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_string;
    validation: StringValidation;
}
export interface ZodTooSmallIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_small;
    minimum: number;
    inclusive: boolean;
    type: "array" | "string" | "number";
}
export interface ZodTooBigIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_big;
    maximum: number;
    inclusive: boolean;
    type: "array" | "string" | "number";
}
export interface ZodInvalidIntersectionTypesIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_intersection_types;
}
export interface ZodNotMultipleOfIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_multiple_of;
    multipleOf: number;
}
export interface ZodCustomIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.custom;
    params?: {
        [k: string]: any;
    };
}
export declare type DenormalizedError = {
    [k: string]: DenormalizedError | string[];
};
export declare type ZodIssueOptionalMessage = ZodInvalidTypeIssue | ZodUnrecognizedKeysIssue | ZodInvalidUnionIssue | ZodInvalidEnumValueIssue | ZodInvalidArgumentsIssue | ZodInvalidReturnTypeIssue | ZodInvalidDateIssue | ZodInvalidStringIssue | ZodTooSmallIssue | ZodTooBigIssue | ZodInvalidIntersectionTypesIssue | ZodNotMultipleOfIssue | ZodCustomIssue;
export declare type ZodIssue = ZodIssueOptionalMessage & {
    message: string;
};
export declare const quotelessJson: (obj: any) => string;
export declare type ZodFormattedError<T> = {
    _errors: string[];
} & (T extends [any, ...any[]] ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : T extends any[] ? ZodFormattedError<T[number]>[] : T extends object ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : unknown);
export declare class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    get errors(): ZodIssue[];
    constructor(issues: ZodIssue[]);
    format: () => ZodFormattedError<T>;
    static create: (issues: ZodIssue[]) => ZodError<any>;
    toString(): string;
    get message(): string;
    get isEmpty(): boolean;
    addIssue: (sub: ZodIssue) => void;
    addIssues: (subs?: ZodIssue[]) => void;
    flatten: <U = string>(mapper?: (issue: ZodIssue) => U) => {
        formErrors: U[];
        fieldErrors: {
            [k: string]: U[];
        };
    };
    get formErrors(): {
        formErrors: string[];
        fieldErrors: {
            [k: string]: string[];
        };
    };
}
declare type stripPath<T extends object> = T extends any ? util.OmitKeys<T, "path"> : never;
export declare type IssueData = stripPath<ZodIssueOptionalMessage> & {
    path?: (string | number)[];
    fatal?: boolean;
};
export declare type MakeErrorData = IssueData;
declare type ErrorMapCtx = {
    defaultError: string;
    data: any;
};
export declare type ZodErrorMap = typeof defaultErrorMap;
export declare const defaultErrorMap: (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};
export declare let overrideErrorMap: (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};
export declare const setErrorMap: (map: ZodErrorMap) => void;
export {};
//# sourceMappingURL=ZodError.d.ts.map