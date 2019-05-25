// Import internal components.
import { IDisableable } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Path, Reflection } from "@/utilities";

/**
 * STUB
 */
export abstract class Command implements IDisableable {
    // Private variables
    private _enabled: boolean = true;

    /**
     * Construct a Command instance.
     * @param doppelgangster A Doppelgangster instance
     */
    constructor(public doppelgangster: Doppelgangster) { }

    /**
     * Return whether the command is enabled.
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Enable the command.
     */
    public enable(): void {
        this._enabled = true;
    }

    /**
     * Disable the command.
     */
    public disable(): void {
        this._enabled = false;
    }
}

/**
 * Define the command's constructor type with the abstract property removed.
 */
export type CommandConstructor =
    typeof Command & (new (doppelgangster: Doppelgangster) => Command);

/**
 * Return all the available commands found in /src/commands.
 */
export function getCommands(): CommandConstructor[] {
    return Reflection.getClassesInDirectory(Path.sourceRootResolve("commands"));
}
