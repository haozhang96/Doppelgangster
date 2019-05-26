// Import external libraries.
import * as $Discord from "discord.js";

/**
 * Define an object holding a context to call a command handler with.
 */
export interface ICommandCallContext {
    readonly message: $Discord.Message;
    readonly arguments: ICommandCallContextArguments;
    readonly parameters: ICommandCallContextParameters;
}

/**
 * Define an object holding the arguments in a command call context.
 */
export interface ICommandCallContextArguments {
    readonly raw: readonly any[];
    readonly named: { readonly [argument: string]: any; };
}

/**
 * Define an object holding the parameters in a command call context.
 */
export interface ICommandCallContextParameters {
    readonly [parameter: string]: any;
}
