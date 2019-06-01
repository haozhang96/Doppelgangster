import { Command } from "@/core/interaction/command";

export class CommandError extends Error {
    constructor(public readonly command: Command, message?: string) {
        super(message);
    }
}
