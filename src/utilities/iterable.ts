// Import internal components.
import { Set } from "./set";

function hasIntersection<T>(...iterables: Array<Iterable<T>>): boolean {
    return Set.intersect(...Set.coerceIterables(iterables)).size > 0;
}

// Expose components.
export const IterableUtils = {
    hasIntersection,
};
