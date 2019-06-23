// tslint:disable: ban-types

export type TypeName<T> = (
    T extends string ?
        "string"
    : T extends number ?
        "number"
    : T extends boolean ?
        "boolean"
    : T extends Function ?
        "function"
    : T extends symbol ?
        "symbol"
    : T extends null ?
        "null"
    : T extends undefined ?
        "undefined"
    : T extends any[] ?
        ArrayTypeName<T>
    :
        "object"
);

export type Type<T> = (
    T extends "string" ?
        string
    : T extends "number" ?
        number
    : T extends "boolean" ?
        boolean
    : T extends "function" ?
        Function
    : T extends "symbol" ?
        symbol
    : T extends "null" ?
        null
    : T extends "undefined" ?
        undefined
    : T extends (
        "string[]" | "number[]" | "boolean[]" | "function[]" | "symbol[]"
        | "null[]" | "undefined[]" | "object[]" | "any[]"
    ) ?
        ArrayType<T>
    :
        object
);

type ArrayTypeName<T> = (
    T extends string[] ?
        "string[]"
    : T extends number[] ?
        "number[]"
    : T extends boolean[] ?
        "boolean[]"
    : T extends Function[] ?
        "function[]"
    : T extends symbol[] ?
        "symbol[]"
    : T extends null[] ?
        "null[]"
    : T extends undefined[] ?
        "undefined[]"
    : T extends object[] ?
        "object[]"
    : T extends any[] ?
        "any[]"
    :
        never
);

type ArrayType<T> = (
    T extends "string[]" ?
        string[]
    : T extends "number[]" ?
        number[]
    : T extends "boolean[]" ?
        boolean[]
    : T extends "function[]" ?
        Function[]
    : T extends "symbol[]" ?
        symbol[]
    : T extends "null[]" ?
        null[]
    : T extends "undefined[]" ?
        undefined[]
    : T extends "object[]" ?
        object[]
    : T extends "any[]" ?
        any[]
    :
        never
);
