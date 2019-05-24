import * as $Utilities from "util";


export const Miscellaneous: {
    getTypeOf(object: any, spaceBetweenTypes?: boolean): string;
    stringifyError(error: Error | undefined, extended?: boolean): string;
} = {
    getTypeOf(object: any, spaceBetweenTypes: boolean = true): string {
        if (object instanceof Array) {
            const childTypes: Set<string> = new Set(object.map(child => this.getTypeOf(child)));
            return (childTypes.size > 1 ? `(${[...childTypes].sort().join(spaceBetweenTypes ? " | " : "|")})` : childTypes.values().next().value) + "[]";
        } else
            return  object === null ? "null" : typeof object === "object" ? object.constructor.name : typeof object;
    },

    stringifyError(error: Error | undefined, extended: boolean = true): string {
        return error ? (extended ? error.stack || $Utilities.inspect(error) : error.toString()) : "Error: Unknown reason";
    }
};