import { Command } from "@/core/interaction/command";

export class CommandError extends Error {
    public readonly commandName: string;

    constructor(public readonly command: Command, message?: string) {
        super(message);
        this.commandName = command.aliases[0];
    }
}
