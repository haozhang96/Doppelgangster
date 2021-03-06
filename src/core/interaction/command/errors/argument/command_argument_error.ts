// Import internal components.
import { Command } from "@/core/interaction/command/command";
import { CommandError } from "@/core/interaction/command/errors/command_error";
import {
    ICommandArgument,
} from "@/core/interaction/command/interfaces/command_argument";

/**
 * TODO
 */
export class CommandArgumentError extends CommandError {
    public readonly argument: ICommandArgument;

    constructor(
        command: Command,
        public readonly argumentIndex: number,
        message?: string,
    ) {
        super(command, message);
        this.argument = (command.arguments || [])[argumentIndex];
    }
}
