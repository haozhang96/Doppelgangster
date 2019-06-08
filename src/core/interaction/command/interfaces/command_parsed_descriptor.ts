// Import internal components.
import { IMappedObject } from "@/common/interfaces";

/**
 * Define an object describing a command parsed from a string.
 */
export interface ICommandParsedDescriptor {
    readonly name: string;
    readonly arguments: readonly string[];
    readonly parameters: Readonly<IMappedObject<string | boolean>>;
}
