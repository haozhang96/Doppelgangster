// import * as FileSystem from "fs";
import { EventEmitter } from "events";

import { Profile, IncomparableCharacteristic } from "@";
import { IWeighted } from "@/Interfaces";
import Configurations from "Configurations";


export abstract class Characteristic<DataT> extends EventEmitter implements IWeighted {
	// Public properties
	public readonly profile: Profile;
	public abstract readonly name: string;
	public abstract readonly description: string;
	public abstract readonly weight: number;

	// Private properties
	private _data: DataT | undefined;
	private _configurations: { [property: string]: any; } | undefined;
	private _initialized: boolean = false;


	/**
	 * Constructor
	 * @param profile The Doppelgangster profile
	 * @param data Characteristic data
	 */
	constructor(profile: Profile, data?: DataT) {
		super(); this.profile = profile; this.data = data;
	}


	// Public methods
	public async initialize(): Promise<this> {
		if (this._initialized !== (this._initialized = true)) {
			await this.initializer();
			await this.collector();
		}
		return this;
	}

	public get hasData(): boolean {
		const data: any = this._data;
		return data !== undefined && !!(
			typeof data.length === "number" ? data.length :
			typeof data.size === "number" ? data.size :
			true
		);
	}
	
	public findSelfInProfile(profile: Profile): this | undefined {
		return profile.characteristics.find(characteristic => characteristic instanceof this.constructor) as this | undefined;
	}

	public toString(): string {
		return `[${this instanceof IncomparableCharacteristic ? "Inc" : "C"}omparableCharacteristic@${this.weight}] ${this.name}: ${this.description}`;
	}


	// Protected methods
	protected get data(): DataT | undefined { return this._data; }
	protected set data(data: DataT | undefined) { if (this._data !== (this._data = data) && !this._initialized) this.emit("data"); }
	protected get configurations(): { [property: string]: any; } { return this._configurations || Configurations.doppelgangster.characteristic.characteristics[this.name]; }
	protected set configurations(configurations: { [property: string]: any; }) { if (!this._initialized) this._configurations = configurations; }


	// Extensible methods
	protected async initializer(): Promise<void> {}
	protected abstract async collector(): Promise<void>;
}