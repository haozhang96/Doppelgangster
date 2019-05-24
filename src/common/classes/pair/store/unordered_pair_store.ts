import { Pair } from "../pair";
import { PairStore } from "./pair_store";

export class UnorderedPairStore<T> extends PairStore<T> {
    public get(one: T, two: T): Pair<T> {
        const pair: Pair<T> | undefined = this.pairs.find((_pair) =>
            (_pair.one === one && _pair.two === two)
            || (_pair.one === two && _pair.two === one),
        );

        if (pair) {
            return pair;
        } else {
            return this.pairs[this.pairs.length] = new Pair(one, two);
        }
    }

    public indexOf(one: T, two: T): number {
        return this.pairs.findIndex((pair) =>
            (pair.one === one && pair.two === two)
            || (pair.one === two && pair.two === one),
        );
    }
}
