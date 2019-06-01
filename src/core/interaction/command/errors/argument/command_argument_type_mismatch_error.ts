// Import internal components.
import { Command } from "@/core/interaction/command/command";
import {
    CommandArgumentError,
} from "@/core/interaction/command/errors/argument/command_argument_error";

/**
 * TODO
 */
export class CommandArgumentTypeMismatchError extends CommandArgumentError {
    public readonly expectedType?: string;

    constructor(
        command: Command,
        argumentIndex: number,
        public readonly givenType: string,
        message?: string,
    ) {
        super(command, argumentIndex, message);
        this.expectedType = this.argument.type;
    }
}
