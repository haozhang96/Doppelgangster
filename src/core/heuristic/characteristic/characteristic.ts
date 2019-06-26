// Import internal components.
import { IWeightable } from "@/common/interfaces/traits";
import { EventEmitter, Expirable, Mix } from "@/common/mixins";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { Profile } from "@/core/heuristic/profile";

/**
 * TODO
 */
export abstract class Characteristic<DataT> extends Mix(DisableableComponent)
    .with(EventEmitter)
    .with(Expirable)
.compose() implements IWeightable {
    // Public constants
    // @Override
    public abstract readonly name: string;
    public abstract readonly description: string;
    public abstract readonly weight: number;

    // Private properties
    private _data?: DataT;

    /**
     * Construct a Characteristic instance.
     * @param profile A Profile instance
     */
    constructor(public readonly profile: Profile) {
        super(profile.doppelgangster);

        this.onMixInComplete(() => {
            if (this.initializer) {
                this.initializer();
            }
            this.collector();
        });
    }

    /**
     * Whether the characteristic has any data depending on its type
     */
    public get hasData(): boolean {
        const data: any = this._data;
        return data !== undefined && data !== null && !!(
            typeof data.length === "number" ? // Data with length property
                data.length
            : typeof data.size === "number" ? // Data with size property
                data.size
            : // Any defined and non-null data
                true
        );
    }

    /**
     * Destroy the Characteristic instance.
     */
    public destroy(): void {
        return;
    }

    public findSelfInProfile(profile: Profile): Optional<this> {
        return profile.characteristics.find((characteristic) =>
            characteristic instanceof this.constructor,
        ) as Optional<this>;
    }

    public toString(): string {
        return `[${
            this.constructor.name
        }@${
            this.weight
        }] ${
            this.name
        }: ${
            this.description
        }`;
    }

    protected get data(): Optional<DataT> {
        return this._data;
    }

    protected set data(data: Optional<DataT>) {
        const oldData = this._data;
        this._data = data;

        // Notify listeners of data change.
        if (data !== oldData && this.enabled) {
            this.emit("data");
        }
    }

    // @Override
    protected initializer?(): Promise<void>;
    protected abstract async collector(): Promise<void>;
}

/**
 * Define the characteristic's class type with the abstract property removed.
 */
export type CharacteristicClass<DataT = any> = typeof Characteristic & (
    new (profile: Profile) => Characteristic<DataT>
);
