// Import internal components.
import { Command } from "@/core/interaction/command/command";
import { CommandError } from "@/core/interaction/command/errors/command_error";
import {
    ICommandParameter,
} from "@/core/interaction/command/interfaces/command_parameter";

/**
 * TODO
 */
export class CommandParameterError extends CommandError {
    public readonly parameter: ICommandParameter;

    constructor(
        command: Command,
        public readonly parameterName: string,
        message?: string,
    ) {
        super(command, message);
        this.parameter = (command.parameters || {})[parameterName];
    }
}
