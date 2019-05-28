// Import internal components.
import { IWeightable } from "@/common/interfaces/traits";
import { EventEmitter, Expirable, Mix } from "@/common/mixins";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { Profile } from "@/core/heuristic/profile";
import { PathUtils, ReflectionUtils } from "@/utilities";

/**
 * STUB
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
    private _data: Optional<DataT>;

    /**
     * Construct a Characteristic instance.
     * @param profile A Profile instance
     */
    constructor(public readonly profile: Profile) {
        super(profile.doppelgangster);

        if (this.initializer) {
            this.initializer();
        }
        this.collector();
    }

    /**
     * Whether the characteristic has any data depending on its type
     */
    public get hasData(): boolean {
        const data: any = this._data;
        return data !== undefined && !!(
            typeof data.length === "number" ?
                data.length
            : typeof data.size === "number" ?
                data.size
            :
                true
        );
    }

    /**
     * Destroy the Characteristic instance.
     */
    public destroy(): void {
        // Do nothing for now.
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
        if (data !== oldData) {
            this.emit("data");
        }
    }

    // @Override
    protected async initializer?(): Promise<void>;
    protected abstract async collector(): Promise<void>;
}

/**
 * Define the characteristic's constructor type with the abstract property
 *   removed.
 */
export type CharacteristicConstructor<DataT = any> = typeof Characteristic & (
    new (profile: Profile) => Characteristic<DataT>
);

/**
 * Return all the available characteristics found in /src/characteristics.
 */
export function getCharacteristics(): CharacteristicConstructor[] {
    return ReflectionUtils.getClassesInDirectory(
        PathUtils.sourceRootResolve("characteristics"),
    );
}
