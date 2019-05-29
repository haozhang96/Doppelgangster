/**
 * Define the fields for a command argument.
 */
export interface ICommandArgument extends Readonly<{
    name?: string;
    description?: string;
    type?: string;
    optional?: boolean;
    default?: any;
}> { }

/**
 * Define an array holding multiple command arguments
 */
export interface ICommandArguments extends ReadonlyArray<ICommandArgument> { }
