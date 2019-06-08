// Import internal components.
import { InstantiableClass } from "@/common/types";
import { SetUtils } from "@/utilities/set";

/**
 * Return an array of a given type of iterable given an array of possibly
 *   different types of iterables.
 * @param Class An instantiable class that 
 * @param iterables An array of iterables to coerce into the given type
 */
export function coerceTypes<
    ClassT extends InstantiableClass<InstanceType<ClassT>>
>(
    Class: ClassT,
    ...iterables: Array<Iterable<any>>
): Array<InstanceType<ClassT>> {
    const coercedIterables: Array<InstanceType<ClassT>> = [];
    for (const iterable of iterables) {
        if (iterable instanceof Class) {
            coercedIterables.push(iterable as InstanceType<ClassT>);
        } else {
            coercedIterables.push(new Class(iterable) as InstanceType<ClassT>);
        }
    }
    return coercedIterables;
}

export function hasIntersection<T>(...iterables: Array<Iterable<T>>): boolean {
    return SetUtils.intersect(
        ...IterableUtils.coerceTypes(Set, iterables)
    ).size > 0;
}

// Expose components.
export const IterableUtils = {
    coerceTypes,
    hasIntersection,
};
