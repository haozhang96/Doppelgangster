// Import internal components.
import { Command } from "@/core/interaction/command/command";
import {
    CommandParameterError,
} from "@/core/interaction/command/errors/parameter/command_parameter_error";

/**
 * TODO
 */
export class CommandParameterTypeMismatchError extends CommandParameterError {
    public readonly expectedType?: string;

    constructor(
        command: Command,
        parameterName: string,
        public readonly givenType: string,
        message?: string,
    ) {
        super(command, parameterName, message);
        this.expectedType = this.parameter.type;
    }
}
