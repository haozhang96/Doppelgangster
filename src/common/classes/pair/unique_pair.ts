import { Pair } from "./pair";

export class UniquePair<T> extends Pair<T> {
    constructor(one: T, two: T) {
        if (one === two) {
            throw new Error(`"${one}" and "${two}" cannot be the same!`);
        }
        super(one, two);
    }
}
