/**
 * Define an object holding a context to call a command handler with.
 */
export interface ICommandCallContext extends Readonly<{
    arguments: ICommandCallContextArguments;
    parameters: ICommandCallContextParameters;
}> { }

/**
 * Define an object holding the arguments in a command call context.
 */
export interface ICommandCallContextArguments extends Readonly<{
    raw: readonly any[];
    named: { readonly [argument: string]: any; };
}> { }

/**
 * Define an object holding the parameters in a command call context.
 */
export interface ICommandCallContextParameters {
    readonly [parameter: string]: any;
}
