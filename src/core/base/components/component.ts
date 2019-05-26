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
 * Define the component's constructor type with the abstract property removed.
 */
export type ComponentConstructor<
    ConstructorT = typeof Component,
    InstanceT = Component
> = ConstructorT & (new (doppelgangster: Doppelgangster) => InstanceT);
