import { IClass } from "./class";

/**
 * An instance of a class; requires runtime constructor check to ensure that it's not a generic object
 */
export interface IInstance {
    // Constructor is a normal or abstract class; check against Object at runtime to ensure it's a valid class
    constructor: IClass;
    prototype?: never; // Exclude classes
    [Symbol.unscopables]?(): never; // Exclude arrays
    [property: string]: any; // Exclude other primitives (except null and undefined)
}
