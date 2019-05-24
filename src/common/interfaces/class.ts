/**
 * A normal or abstract class
 */
// export type Class = () => void & { prototype: { constructor: Class; }; };
export interface IClass {
    prototype: { constructor: IClass; };
    new (): any;
}

/**
 * An array holding a class as the first element and its constructor arguments as the rest
 */
export interface IClassConstructionArray {
    0: IClass;
    [index: number]: any;
}
