// Import internal components.
import { IDestructible, IDisableable } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Path, Reflection } from "@/utilities";

/**
 * STUB
 */
export abstract class Module implements IDisableable, IDestructible {
    // Private variables
    private _enabled: boolean = true;

    /**
     * Construct a Module instance.
     * @param doppelgangster A Doppelgangster instance
     */
    constructor(public doppelgangster: Doppelgangster) { }

    /**
     * Return whether the module is enabled.
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Enable the module.
     */
    public enable(): void {
        this._enabled = true;
    }

    /**
     * Disable the module.
     */
    public disable(): void {
        this._enabled = false;
    }

    // @Override
    public abstract destroy(): void;
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor =
    typeof Module & (new (doppelgangster: Doppelgangster) => Module);

/**
 * Return all the available modules found in /src/modules.
 */
export function getModules(): ModuleConstructor[] {
    return Reflection.getClassesInDirectory(Path.sourceRootResolve("modules"));
}
