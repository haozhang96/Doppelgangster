// Import internal components.
import { IDisableable } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Path, Reflection } from "@/utilities";

/**
 * STUB
 */
export abstract class Characteristic implements IDisableable {
    // Private variables
    private _enabled: boolean = true;

    /**
     * Construct a Characteristic instance.
     * @param doppelgangster A Doppelgangster instance
     */
    constructor(public doppelgangster: Doppelgangster) { }

    /**
     * Return whether the characteristic is enabled.
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Enable the characteristic.
     */
    public enable(): void {
        this._enabled = true;
    }

    /**
     * Disable the characteristic.
     */
    public disable(): void {
        this._enabled = false;
    }
}

/**
 * Define the characteristic's constructor type with the abstract property
 *   removed.
 */
export type CharacteristicConstructor = typeof Characteristic & (
    new (doppelgangster: Doppelgangster) => Characteristic
);

/**
 * Return all the available characteristics found in /src/characteristics.
 */
export function getCharacteristics(): CharacteristicConstructor[] {
    return Reflection.getClassesInDirectory(
        Path.sourceRootResolve("characteristics"),
    );
}
