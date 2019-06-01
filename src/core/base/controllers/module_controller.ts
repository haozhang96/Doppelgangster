// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Module } from "@/core/base/module";

/**
 * STUB
 */
export abstract class ModuleController extends Controller {
    // Public properties
    public abstract readonly modules: Readonly<IMappedObject<Module>>;

    /**
     * Destroy the ModuleController instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all module instances.
        for (const module of Object.values(this.modules)) {
            await module.destroy();
        }
    }
}

/**
 * Define the ModuleController's constructor type with the abstract property
 *   removed.
 */
export type ModuleControllerConstructor =
    ControllerConstructor<typeof ModuleController, ModuleController>;
