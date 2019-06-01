// Import internal components.
import { Callback } from "@/common/types";

/**
 * Define an object holding a command call's result.
 */
export interface ICommandCallResult {
    type: CommandCallResultType;
    message?: string;
    callback?: Callback;
}

/**
 * Define an enumeration of command call result types.
 */
export enum CommandCallResultType {
    SUCCESS,
    FAILURE,
}
