// Import internal components.
import { IClass, IClassConstructionArray } from "@/common/interfaces/class";
import { IInstance } from "@/common/interfaces/instance";

// Import internal libraries.
import { FileSystem } from ".";

/**
 * Return all the default classes in every file found within a given directory.
 * @param directory The directory to recursively scan for classes
 */
function getClassesInDirectory<T>(directory: string): T[] {
    return FileSystem.getAllFilePaths(directory).filter((file) =>
        file.endsWith(".ts"),
    ).map((file) =>
        require(file.slice(0, -3)).default,
    );
}

/**
 * Return the type name of an object.
 * @param object The object to return the type name of
 * @param spaceBetweenTypes Whether to put spaces between type names
 */
function getTypeOf(
    object: any,
    spaceBetweenTypes: boolean = true,
): string {
    if (object instanceof Array) {
        let typeName: string;
        const childTypes: Set<string> = new Set(
            object.map((child) => getTypeOf(child)),
        );

        if (childTypes.size > 1) {
            const delimiter: string = spaceBetweenTypes ? " | " : "|";
            typeName = `(${[...childTypes].sort().join(delimiter)})`;
        } else {
            typeName = childTypes.values().next().value;
        }
        return typeName + "[]";
    } else {
        return (
            object === null ?
                "null"
            : typeof object === "object" ?
                object.constructor.name
            :
                typeof object
        );
    }
}

/**
 * Applies mix-in instance and/or class properties to a base instance or class
 * @param Base The base instance or class to apply the mix-ins to
 * @param Mixins The mix-in instances and/or classes to apply to the base
 */
function mixIn(
    Base: IInstance | IClass,
    Mixins: Array<IInstance | IClass | IClassConstructionArray>,
): typeof Base {
    // Perform runtime argument type checks that cannot be done at compile time.
    if (!Base || Base.constructor === Object) {
        // Make sure the base is non-null and that it's not just a generic
        //   object.
        throw new TypeError(
            "You must pass a valid instance or class for the base argument!"
        );
    } else {
        // Make sure all the mix-ins are valid instances and/or classes.
        for (const [index, Mixin] of Mixins.entries()) {
            if (!Mixin || Mixin.constructor === Object) {
                // Make sure the mix-in is non-null and that it's not just a
                //   generic object.
                throw new TypeError(`${
                    Mixin
                } @ Mixins[${
                    index
                }] is not a valid instance or class!`);
            }
        }
    }

    // Apply mix-ins
    for (const _Mixin of Mixins) {
        const Mixin: any = _Mixin instanceof Array ? _Mixin[0] : _Mixin;
        const mixinConstructorArguments: any[] =
            _Mixin instanceof Array ? _Mixin.slice(1) : [];

        const isConstructor: boolean = Mixin.constructor === Function;
        const classProperties: PropertyDescriptorMap =
            Object.getOwnPropertyDescriptors(
                isConstructor ? Mixin.prototype : Mixin.constructor.prototype,
            );
        const instanceProperties: PropertyDescriptorMap =
            Object.getOwnPropertyDescriptors(
                isConstructor ? new Mixin(...mixinConstructorArguments) : Mixin,
            );

        // Do not copy over constructors.
        delete classProperties.constructor;

        // Copy over mix-in properties appropriately
        if (Base.constructor === Function) {
            // Base is a class. Copy both the mix-in's class and instance
            //   properties to the base class' prototype.
            Object.defineProperties(
                Base.prototype,
                Object.assign(classProperties, instanceProperties),
            );
        } else {
            // Base is an instance. Copy the mix-in's class properties to the
            //   base instance's constructor's/class' prototype.
            Object.defineProperties(
                Base.constructor.prototype,
                classProperties,
            );

            // Copy the mix-in's instance properties to the base instance.
            Object.defineProperties(Base, instanceProperties);
        }
    }

    return Base;
}

// Expose components.
export const ReflectionUtils = {
    getClassesInDirectory,
    getTypeOf,
    mixIn,
};
