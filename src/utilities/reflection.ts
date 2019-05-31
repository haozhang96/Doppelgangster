// Import internal components.
import {
    IClass, IClassConstructionArray, IInstance,
} from "@/common/interfaces";
import { Class, InstantiableClass } from "@/common/types";

// Import internal libraries.
import { FileSystemUtils } from "./file_system";

/**
 * Deabstractify an abstract class for TypeScript's type-checking system.
 * @param AbstractClass An abstract class to deabstractify
 */
function deabstractifyClass<ClassT extends Class>(AbstractClass: ClassT) {
    return AbstractClass as ClassT & InstantiableClass;
}

/**
 * Return all the default classes in every file found within a given directory.
 * @param directory The directory to recursively scan for classes
 */
function getClassesInDirectory<T>(directory: string): T[] {
    return FileSystemUtils.getAllFilePaths(directory).filter((file) =>
        file.endsWith(".js"),
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
 * @param MixIns The mix-in instances and/or classes to apply to the base
 */
function mixIn(
    Base: IInstance | IClass,
    MixIns: Array<IInstance | IClass | IClassConstructionArray>,
): typeof Base {
    // Perform runtime argument type checks that cannot be done at compile time.
    if (!Base || Base.constructor === Object) {
        // Make sure the base is non-null and that it's not just a generic
        //   object.
        throw new TypeError(
            "You must pass a valid instance or class for the base argument!",
        );
    } else {
        // Make sure all the mix-ins are valid instances and/or classes.
        for (const [index, MixIn] of MixIns.entries()) {
            if (!MixIn || MixIn.constructor === Object) {
                // Make sure the mix-in is non-null and that it's not just a
                //   generic object.
                throw new TypeError(`${
                    MixIn
                } @ Mixins[${
                    index
                }] is not a valid instance or class!`);
            }
        }
    }

    // Apply mix-ins
    for (const _MixIn of MixIns) {
        const Mixin: any = _MixIn instanceof Array ? _MixIn[0] : _MixIn;
        const mixinConstructorArguments: any[] =
            _MixIn instanceof Array ? _MixIn.slice(1) : [];

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
    deabstractifyClass,
    getClassesInDirectory,
    getTypeOf,
    mixIn,
};
