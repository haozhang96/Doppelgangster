import { Optional } from "@/common/types";
import { Command, CommandArgumentError } from "@/core/interaction/command";

export class CommandArgumentTypeMismatchError extends CommandArgumentError {
    public readonly expectedType: Optional<string>;

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
