import { Set as SetUtilities } from "@/utilities/set";

/**
 * The ExtendedSet class extends the built-in Set class to provides set
 *   operations.
 */
export class ExtendedSet<T> extends Set<T> {
    public static fromIterables<T>(
        ...iterables: Array<Iterable<T>>
    ): ExtendedSet<T> {
        return ExtendedSet.fromCoercedCall<T>(SetUtilities.union, ...iterables);
    }

    private static fromCoercedCall<T>(
        callback: (...args: any[]) => Iterable<T>,
        ...iterables: Array<Iterable<T>>
    ): ExtendedSet<T> {
        return new ExtendedSet(
            callback(...SetUtilities.coerceIterables(iterables)),
        );
    }

    public difference(...iterables: Array<Iterable<T>>): ExtendedSet<T> {
        return ExtendedSet.fromCoercedCall<T>(
            SetUtilities.difference,
            this, ...iterables,
        );
    }

    public differenceUpdate(...iterables: Array<Iterable<T>>): this {
        // Find the union of all the iterables.
        const union: Set<T> = ExtendedSet.fromCoercedCall<T>(
            SetUtilities.union,
            ...iterables,
        );

        // Remove all values found in any of the iterables.
        for (const value of union) {
            this.delete(value);
        }

        return this;
    }

    public intersect(...iterables: Array<Iterable<T>>): ExtendedSet<T> {
        return ExtendedSet.fromCoercedCall<T>(
            SetUtilities.intersect,
            this, ...iterables,
        );
    }

    public union(...iterables: Array<Iterable<T>>): ExtendedSet<T> {
        return ExtendedSet.fromCoercedCall<T>(
            SetUtilities.union,
            this, ...iterables,
        );
    }

    public update(...iterables: Array<Iterable<T>>): this {
        for (const iterable of iterables) {
            for (const value of iterable) {
                this.add(value);
            }
        }
        return this;
    }
}
