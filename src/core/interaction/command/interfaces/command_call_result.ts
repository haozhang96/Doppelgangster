/**
 * Define an object holding a command call's result.
 */
export interface ICommandCallResult extends Readonly<{
    type: CommandCallResultType;
    message?: string;
}> { }

/**
 * Define an enumeration of command call result types.
 */
export enum CommandCallResultType {
    SUCCESS,
    FAILURE,
}
