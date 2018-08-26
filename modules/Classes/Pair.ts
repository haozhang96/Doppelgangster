export class Pair<T> {
	constructor(public readonly one: T, public readonly two: T) {}
}


export class UniquePair<T> extends Pair<T> {
	constructor(one: T, two: T) {
		if (one === two) throw new TypeError(`"${one}" and "${two}" cannot be the same!`);
		super(one, two);
	}
}


abstract class PairStore<T> {
	protected pairs: Pair<T>[] = [];


	// Public methods
	public abstract get(one: T, two: T): Pair<T>;

	public remove(one: T, two: T): this {
		const index: number = this.indexOf(one, two);
		if (index !== -1) this.pairs.splice(index, 1);
		return this;
	}

	public clear(): this {
		return this.pairs.splice(0) && this;
	}

	public contains(one: T, two: T): boolean {
		return this.indexOf(one, two) !== -1;
	}


	// Protected methods
	protected abstract indexOf(one: T, two: T): number;
}


export class UnorderedPairStore<T> extends PairStore<T> {
	public get(one: T, two: T): Pair<T> {
		return this.pairs.find(pair => pair.one === one && pair.two === two || pair.one === two && pair.two === one) || (this.pairs[this.pairs.length] = new Pair(one, two));
	}

	protected indexOf(one: T, two: T): number {
		return this.pairs.findIndex(pair => pair.one === one && pair.two === two || pair.one === two && pair.two === one);
	}
}


export class OrderedPairStore<T> extends PairStore<T> {
	public get(one: T, two: T): Pair<T> {
		return this.pairs.find(pair => pair.one === one && pair.two === two) || (this.pairs[this.pairs.length] = new Pair(one, two));
	}

	protected indexOf(one: T, two: T): number {
		return this.pairs.findIndex(pair => pair.one === one && pair.two === two);
	}
}