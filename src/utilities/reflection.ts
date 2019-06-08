// Import internal components.
import { Class, InstantiableClass } from "@/common/types";
import { FileSystemUtils } from "@/utilities/file_system";

// Import built-in libraries.
import * as $Path from "path";

/**
 * Deabstractify an abstract class for TypeScript's type-checking system.
 * @param AbstractClass An abstract class to deabstractify
 */
export function deabstractifyClass<ClassT extends Class>(
    AbstractClass: ClassT,
) {
    return AbstractClass as ClassT & InstantiableClass;
}

/**
 * Return all the default classes in every file found within a given directory.
 * @param pathSegments The path segments to resolve for the directory to
 *   recursively scan default classes for
 */
export function getDefaultClassesInDirectory<T>(
    ...pathSegments: string[]
): T[] {
    return FileSystemUtils.getAllFilePaths(
        $Path.resolve(...pathSegments),
    ).filter((file) =>
        file.endsWith(".js"),
    ).map((file) =>
        require(file.slice(0, -3)).default,
    ).filter((_Class) =>
        _Class !== undefined,
    );
}

/**
 * Return the type name of an object.
 * @param object The object to return the type name of
 * @param spaceBetweenTypes Whether to put spaces between type names
 */
export function getTypeNames(
    object: any,
    spaceBetweenTypes: boolean = true,
): string {
    if (object instanceof Array) {
        let typeName: string;
        const childTypes: Set<string> = new Set(
            object.map((child) => getTypeNames(child)),
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

// Expose components.
export const ReflectionUtils = {
    deabstractifyClass,
    getDefaultClassesInDirectory,
    getTypeNames,
};
