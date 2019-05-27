/**
 * A normal or abstract class
 */
// export type Class = () => void & { prototype: { constructor: Class; }; };
export interface IClass<InstanceT = any> extends Function {
    prototype: { constructor: IClass; };
    new (...args: any[]): InstanceT;
}

/**
 * An array holding a class as the first element and its constructor arguments as the rest
 */
export interface IClassConstructionArray<InstanceT = any> {
    0: IClass<InstanceT>;
    [index: number]: any;
}
