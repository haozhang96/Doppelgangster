// Import internal components.
import { IDisableable } from "@/common/interfaces/traits";
import {
    Component, ComponentClass,
} from "@/core/base/components/component";

/**
 * TODO
 */
export abstract class DisableableComponent
        extends Component implements IDisableable {
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
 * Define the DisableableComponent's class type with the abstract property
 *   removed.
 */
export type DisableableComponentClass<
    ClassT = typeof DisableableComponent,
    InstanceT = DisableableComponent
> = ComponentClass<ClassT, InstanceT>;
