// Import internal components.
import { Callback } from "@/common/types";

/**
 * Define an object holding a command call's result.
 */
export interface ICommandCallResult {
    readonly type: CommandCallResultType;
    readonly message?: string;
    readonly callback?: Callback;
}

/**
 * Define an enumeration of command call result types.
 */
export enum CommandCallResultType {
    SUCCESS,
    FAILURE,
    ACTION_REQUIRED,
}
