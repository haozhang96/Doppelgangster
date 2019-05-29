import { Optional } from "@/common/types";
import { Command, CommandParameterError } from "@/core/interaction/command";

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
