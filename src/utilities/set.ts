// Keep a reference to the original Set object.
const $Set: globalThis.SetConstructor = global.Set;

/**
 * Return an array of sets given an array of iterables.
 * @param iterables An array of iterables to coerce into sets
 */
function coerceIterables<T>(iterables: Array<Iterable<T>>): Array<Set<T>> {
    return iterables.map((iterable) =>
        iterable instanceof $Set ? iterable : new $Set(iterable),
    );
}

/**
 * Return the difference between a main set and an array of sets.
 * @param sets An array of sets to find the difference between the main set
 */
function difference<T>(mainSet: Set<T>, ...otherSets: Array<Set<T>>): Set<T> {
    const unionOthers: Set<T> = union(...otherSets);
    return new $Set([...mainSet].filter((value) => !unionOthers.has(value)));
}

/**
 * Return the intersection of a given array of sets.
 * @param sets An array of sets to intersect
 */
function intersect<T>(...sets: Array<Set<T>>): Set<T> {
    // Use the smallest set as the initial intersection set. Note that both
    //   Array.sort() and Array.splice() mutate the original array.
    const intersection: Set<T> = (
        sets.length > 0 ?
            new $Set(sets.sort((a, b) => a.size - b.size).splice(0, 1)[0])
        :
            new $Set()
    );

    // Remove values from the intersection set that do not exist in every other
    //   set.
    for (const value of intersection) {
        if (!sets.every((set) => set.has(value))) {
            intersection.delete(value);
        }
    }

    return intersection;
}

/**
 * Return the union of a given array of sets.
 * @param sets An array of sets to union together
 */
function union<T>(...sets: Array<Set<T>>): Set<T> {
    return new $Set(sets.map((set) => [...set]).flat());
}

// Expose components.
export const Set = {
    coerceIterables,
    difference,
    intersect,
    union,
};
