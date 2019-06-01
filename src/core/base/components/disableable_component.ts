// Import internal components.
import { IDisableable } from "@/common/interfaces/traits";
import {
    Component, ComponentConstructor,
} from "@/core/base/components/component";

/**
 * STUB
 */
export abstract class DisableableComponent extends Component implements IDisableable {
    // Private variables
    private _enabled: boolean = true;

    /**
     * Return whether the component is enabled.
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Enable the component.
     */
    public enable(): void {
        this._enabled = true;
    }

    /**
     * Disable the component.
     */
    public disable(): void {
        this._enabled = false;
    }
}

/**
 * Define the disableable component's constructor type with the abstract
 *   property removed.
 */
export type DisableableComponentConstructor<
    ConstructorT = typeof DisableableComponent,
    InstanceT = DisableableComponent
> = ComponentConstructor<ConstructorT, InstanceT>;
