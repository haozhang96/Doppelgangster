/**
 * A normal or abstract class
 */
type Class = Function & { prototype: { constructor: Class; }; };

/**
 * An array holding a class as the first element and its constructor arguments as the rest
 */
type ClassConstructionArray = { 0: Class; [index: number]: any };

/**
 * An instance of a class; requires runtime constructor check to ensure that it's not a generic object
 */
type Instance = {
    constructor: Class; // Constructor is a normal or abstract class; check against Object at runtime to ensure it's a valid class
    prototype?: never; // Exclude classes
    [Symbol.unscopables]?(): never; // Exclude arrays
    [property: string]: any; // Exclude other primitives (except null and undefined)
};


export const Class: {
    mixIn(Base: Instance | Class, Mixins: (Instance | Class | ClassConstructionArray)[]): typeof Base;
} = {
    /**
     * Applies mix-in instance and/or class properties to a base instance or class
     * @param Base The base instance or class to apply the mix-ins to
     * @param Mixins The mix-in instances and/or classes to apply to the base
     */
    mixIn(Base: Instance | Class, Mixins: (Instance | Class | ClassConstructionArray)[]): typeof Base {
        // Perform runtime argument type checks that cannot be done at compile time
        if (!Base || Base.constructor === Object) // Make sure the base is non-null and that it's not just a generic object
            throw new TypeError("You must pass a valid instance or class for the base argument!");
        else // Make sure all the mix-ins are valid instances and/or classes
            for (const [index, Mixin] of Mixins.entries())
                if (!Mixin || Mixin.constructor === Object) // Make sure the mix-in is non-null and that it's not just a generic object
                    throw new TypeError(`${Mixin} @ Mixins[${index}] is not a valid instance or class!`);

        // Apply mix-ins
        for (const _Mixin of Mixins) {
            const   Mixin: any = _Mixin instanceof Array ? _Mixin[0] : _Mixin, mixinConstructorArguments: any[] = _Mixin instanceof Array ? _Mixin.slice(1) : [],
                    classProperties: PropertyDescriptorMap = Object.getOwnPropertyDescriptors(Mixin.constructor === Function ? Mixin.prototype : Mixin.constructor.prototype),
                    instanceProperties: PropertyDescriptorMap = Object.getOwnPropertyDescriptors(Mixin.constructor === Function ? new Mixin(...mixinConstructorArguments) : Mixin);
            delete classProperties.constructor; // Do not copy over constructors

            // Copy over mix-in properties appropriately
            if (Base.constructor === Function) // Base is a class
                Object.defineProperties(Base.prototype, Object.assign(classProperties, instanceProperties)); // Copy both the mix-in's class and instance properties to the base class' prototype
            else { // Base is an instance
                Object.defineProperties(Base.constructor.prototype, classProperties); // Copy the mix-in's class properties to the base instance's constructor's/class' prototype
                Object.defineProperties(Base, instanceProperties); // Copy the mix-in's instance properties to the base instance
            }
        }

        return Base;
    }
};