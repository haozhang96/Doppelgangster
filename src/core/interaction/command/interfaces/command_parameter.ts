// Import internal components.
import { IMappedObject } from "@/common/interfaces";

/**
 * Define the fields for a command parameter.
 */
export interface ICommandParameter {
    readonly aliases?: string[];
    readonly description?: string;
    readonly type?: string;
    readonly optional?: boolean;
    readonly default?: any;
}

/**
 * Define an object holding multiple command parameters.
 */
export interface ICommandParameters extends Readonly<IMappedObject<ICommandParameter>> { }
