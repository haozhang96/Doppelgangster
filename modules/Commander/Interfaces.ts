import * as Discord from "discord.js";


/********************
 * Command defining
 ********************/

/**
 * Defines the fields for a command argument
 */
export interface ICommandArgument {
    readonly name?: string;
    readonly description?: string;
    readonly type?: string;
    readonly optional?: boolean;
    readonly default?: any;
}

/**
 * Defines the fields for a command parameter
 */
export interface ICommandParameter {
    readonly aliases?: string[];
    readonly description?: string;
    readonly type?: string;
    readonly optional?: boolean;
    readonly default?: any;
}

/**
 * Defines an object holding multiple command parameters
 */
export interface ICommandParameters {
    readonly [parameter: string]: ICommandParameter;
}

/**
 * A union type used to determine a command's permissions
 */
export type CommandPermissible = Discord.User | string /* Discord user ID */ | Discord.Role | Discord.PermissionResolvable | undefined;


/*******************
 * Command parsing
 *******************/

/**
 * A command parsed from a string
 */
export interface ICommandParsedDescriptor {
    readonly name: string;
    readonly arguments: ReadonlyArray<string>;
    readonly parameters: { readonly [parameter: string]: string | boolean; };
}


/*******************
 * Command calling
 *******************/

/**
 * A context to call a command handler with
 */
export interface ICommandCallContext {
    readonly message: Discord.Message;
    readonly arguments: ICommandCallContextArguments;
    readonly parameters: ICommandCallContextParameters;
}

/**
 * Holds the arguments in a command call context
 */
export interface ICommandCallContextArguments {
    readonly raw: ReadonlyArray<any>;
    readonly named: { readonly [argument: string]: any; };
}

/**
 * Holds the parameters in a command call context
 */
export interface ICommandCallContextParameters {
    readonly [parameter: string]: any;
}