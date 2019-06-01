/**
 * Define an object describing a command parsed from a string.
 */
export interface ICommandParsedDescriptor {
    readonly name: string;
    readonly arguments: readonly string[];
    readonly parameters: { readonly [parameter: string]: string | boolean; };
}
