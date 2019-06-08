/**
 * Define the fields for a command argument.
 */
export interface ICommandArgument {
    readonly name?: string;
    readonly description?: string;
    readonly type?: string;
    readonly optional?: boolean;
    readonly default?: any;
}

/**
 * Define an array holding multiple command arguments
 */
export interface ICommandArguments extends ReadonlyArray<ICommandArgument> { }
