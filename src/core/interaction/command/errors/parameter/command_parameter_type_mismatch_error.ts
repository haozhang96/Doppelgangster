// Import internal components.
import { Optional } from "@/common/types";
import { Command } from "@/core/interaction/command/command";
import {
    CommandParameterError,
} from "@/core/interaction/command/errors/parameter/command_parameter_error";

/**
 * STUB
 */
export class CommandParameterTypeMismatchError extends CommandParameterError {
    public readonly expectedType: Optional<string>;

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
