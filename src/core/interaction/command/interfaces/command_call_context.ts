// Import internal components.
import { IMappedObject } from "@/common/interfaces";

/**
 * Define an object holding a context to call a command handler with.
 */
export interface ICommandCallContext {
    readonly arguments: Readonly<ICommandCallContextArguments>;
    readonly parameters: Readonly<ICommandCallContextParameters>;
}

/**
 * Define an object holding the arguments in a command call context.
 */
export interface ICommandCallContextArguments {
    raw: any[];
    named: IMappedObject<any>;
}

/**
 * Define an object holding the parameters in a command call context.
 */
export interface ICommandCallContextParameters extends IMappedObject<any> { }
