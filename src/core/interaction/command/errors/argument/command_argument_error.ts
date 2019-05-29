import {
    Command, CommandError, ICommandArgument, ICommandArguments,
} from "@/core/interaction/command";

export class CommandArgumentError extends CommandError {
    public readonly argument: ICommandArgument;

    constructor(
        command: Command,
        public readonly argumentIndex: number,
        message?: string,
    ) {
        super(command, message);
        this.argument = (command.arguments as ICommandArguments)[argumentIndex];
    }
}
