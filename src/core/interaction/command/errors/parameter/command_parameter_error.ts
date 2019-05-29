import {
    Command, CommandError, ICommandParameter, ICommandParameters,
} from "@/core/interaction/command";

export class CommandParameterError extends CommandError {
    public readonly parameter: ICommandParameter;

    constructor(
        command: Command,
        public readonly parameterName: string,
        message?: string,
    ) {
        super(command, message);
        this.parameter =
            (command.parameters as ICommandParameters)[parameterName];
    }
}
