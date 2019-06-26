// Import internal components.
import { IDestructible } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";

/**
 * Define the base class that all Doppelgangster components should extend from.
 */
export abstract class Component implements IDestructible {
    /**
     * Construct a Component instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(public readonly doppelgangster: Doppelgangster) { }

    // @Override
    public abstract destroy(): void;
}

/**
 * Define the Component's class type with the abstract property removed.
 */
export type ComponentClass<
    ClassT = typeof Component,
    InstanceT = Component
> = ClassT & (new (doppelgangster: Doppelgangster) => InstanceT);
