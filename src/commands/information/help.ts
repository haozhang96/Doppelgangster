// Import Doppelgangster components.
import {
    Command, CommandCallResultType, ICommandCallContext, ICommandCallResult,
} from "@/core/interaction/command";

export default class extends Command {
    public aliases = ["commands", "cmds", "help"];
    public description = "Display a list of available commands.";

    public async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult> {
        const commands: string[] =
            context.doppelgangster.controllers.command.map((controller) =>
                [...controller.registry.values()].map((_commands) =>
                    _commands.map((command) =>
                        (command.name.slice(0, 13) + ": ").padEnd(15) + (
                            command.description || "No description available."
                        ),
                    ),
                ),
            ).flat(2).sort();

        return {
            message: (
                "Here is a list of available commands:"
                + "\n```"
                + commands.join("\n")
                + "\n\```"
            ),
            type: CommandCallResultType.SUCCESS,
        };
    }
}
