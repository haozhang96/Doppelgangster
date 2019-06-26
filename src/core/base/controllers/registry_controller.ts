// Import internal components.
import { Callback, InstantiableClass, Optional } from "@/common/types";
import { Component } from "@/core/base/components";
import {
    Controller, ControllerClass,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class RegistryController<
    ClassT extends InstantiableClass,
    InstanceT extends InstanceType<ClassT>
> extends Controller {
    private readonly _registry: Map<ClassT, InstanceT[]> = new Map();

    /**
     * Return a copy of the registry.
     */
    public get registry(): Map<ClassT, InstanceT[]> {
        return new Map(this._registry);
    }

    /**
     * Destroy the Controller instance.
     */
    public async destroy(): Promise<void> {
        // Call the destroy() method on Component instances.
        for (const instances of this._registry.values()) {
            for (const instance of instances) {
                if (instance instanceof Component) {
                    await instance.destroy();
                }
            }
        }

        // Clear the registry.
        this._registry.clear();
    }

    /**
     * Find a class in the registry using a predicate callback.
     * @param callback The callback used to determine whether a class matches
     */
    public findClass(
        callback: Callback<ClassT, boolean>,
    ): Optional<ClassT> {
        for (const _Component of this._registry.keys()) {
            if (callback(_Component)) {
                return _Component;
            }
        }
    }

    /**
     * Find an instance in the registry using a predicate callback.
     * @param callback The callback used to determine whether an instance
     *   matches
     */
    public findInstance(
        callback: Callback<InstanceT, boolean>,
    ): Optional<InstanceT> {
        for (const components of this._registry.values()) {
            for (const component of components) {
                if (callback(component)) {
                    return component;
                }
            }
        }
    }

    /**
     * Register a component class in the register.
     * @param _Component A Component class
     */
    public registerClass(_Component: ClassT): InstanceT[] {
        if (!this._registry.has(_Component)) {
            this._registry.set(_Component, []);
        }
        return this._registry.get(_Component) as InstanceT[];
    }

    /**
     * Register a component instance in the register.
     * @param component A Component instance
     */
    public registerInstance(component: InstanceT): void {
        const classRegistry: InstanceT[] =
            this.registerClass(component.constructor as ClassT);
        if (!classRegistry.includes(component)) {
            classRegistry.push(component);
        }
    }
}

/**
 * Define the RegistryController's class type with the abstract property
 *   removed.
 */
export type RegistryControllerClass<
    ClassT = typeof RegistryController,
    InstanceT = RegistryController<any, any>
> = ControllerClass<ClassT, InstanceT>;
