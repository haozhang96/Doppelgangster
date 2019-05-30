// Import internal components.
import { SetUtils } from "./set";

function hasIntersection<T>(...iterables: Array<Iterable<T>>): boolean {
    return SetUtils.intersect(...SetUtils.coerceIterables(iterables)).size > 0;
}

// Expose components.
export const IterableUtils = {
    hasIntersection,
};
