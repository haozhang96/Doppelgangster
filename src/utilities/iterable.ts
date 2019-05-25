// Import internal components.
import { Set } from "./set";

function intersectOnce<T>(...iterables: Array<Iterable<T>>): boolean {
    return Set.intersect(...Set.coerceIterables(iterables)).size > 0;
}

// Expose components.
export const Iterable = {
    intersectOnce,
};
