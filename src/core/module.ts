// Import internal components.
import { IDestructible } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Reflection } from "@/utilities";

/**
 * STUB
 */
export abstract class Module implements IDestructible {
    // Public constants
    public static readonly enabled: boolean = true;

    constructor(public doppelgangster: Doppelgangster) { }

    // @Override
    public abstract destroy(): void;
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor =
    typeof Module & (new (doppelgangster: Doppelgangster) => Module);

/**
 * Return all the available modules.
 */
export function getModules(): ModuleConstructor[] {
    return Reflection.getClassesInDirectory("../modules");
}
