import { Pair } from "../pair";

import { ICollection } from "@/common/interfaces/collection";

export abstract class PairStore<T> implements ICollection<Pair<T>> {
    protected pairs: Array<Pair<T>> = [];

    public remove(one: T, two: T): boolean {
        const index: number = this.indexOf(one, two);

        if (index !== -1) {
            this.pairs.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    public clear(): void {
        this.pairs.splice(0);
    }

    public contains(one: T, two: T): boolean {
        return this.indexOf(one, two) !== -1;
    }

    // @Override
    public abstract get(one: T, two: T): Pair<T>;
    public abstract indexOf(one: T, two: T): number;
}
