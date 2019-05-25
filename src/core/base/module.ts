// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { IDestructible, IDisableable } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Logging, Path, Reflection } from "@/utilities";

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
    constructor(public doppelgangster: Doppelgangster) {
        Logging.info(`Instantiating the ${this.constructor.name} module...`);
    }

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
export function getModules(): IMappedObject<ModuleConstructor> {
    const moduleMap: IMappedObject<ModuleConstructor> = {};
    const modules: ModuleConstructor[] =
        Reflection.getClassesInDirectory(Path.sourceRootResolve("modules"));

    // Create a module map with the first character of the modules' names set to
    //   lowercase.
    for (const module of modules) {
        moduleMap[module.name[0].toLowerCase() + module.name.slice(1)] = module;
    }

    return moduleMap;
}
