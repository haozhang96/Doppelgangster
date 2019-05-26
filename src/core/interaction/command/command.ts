// Import internal components.
import {
    DisableableComponent, DisableableComponentConstructor,
} from "@/core/base/components";

/**
 * STUB
 */
export abstract class Command extends DisableableComponent {
    // Public variables
    // @Override
    public abstract readonly aliases: string[];
    public readonly description?: string;
    public readonly arguments?: ICommandArgument[];
    public readonly parameters?: ICommandParameters;

    // Protected variables
    protected readonly permitted?: CommandPermissible[];

    // Private variables
    private _help?: string;

    // @Override
    public abstract async handler(context: ICommandCallContext): Promise<void>;
}

/**
 * Define the command's constructor type with the abstract property removed.
 */
export type CommandConstructor =
    DisableableComponentConstructor<typeof Command, Command>;
