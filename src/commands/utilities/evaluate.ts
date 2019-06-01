// Import Doppelgangster components.
import {
    Command, CommandCallResultType, ICommandCallContext, ICommandCallResult,
} from "@/core/interaction/command";

// Import built-in libraries.
import * as $Utilities from "util";
import { runInNewContext as safeEval } from "vm";

export default class extends Command {
    public aliases = ["evaluate", "js", "console"];
    public description = "Evaluate JavaScript code and pretty-print its result.";
    public permitted = [
        "147458853456314368",
    ];
    public arguments = [
        {
            description: "JavaScript code to run",
            name: "code",
        },
    ];
    public parameters = {
        newContext: {
            aliases: ["nc"],
            description: "Run in a new context",
            optional: true,
            type: "boolean",
        },
        timeout: {
            aliases: ["t", "duration"],
            default: 5000,
            description: "Execution duration in milliseconds before timing out",
            optional: true,
            type: "number",
        },
    };

    public async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult> {
        const started: number = Date.now();

        try {
            const returned: any = safeEval(
                context.arguments.named.code,
                context.parameters.newContext ? undefined : this,
                { timeout: context.parameters.timeout },
            );

            return {
                message: (
                    `Your JavaScript code returned the following (${
                        Date.now() - started
                    } ms):\`\`\`\n${
                        $Utilities.inspect(returned).slice(0, 1850)
                    }\`\`\``
                ),
                type: CommandCallResultType.SUCCESS,
            };
        } catch (error) {
            return {
                message: (
                    "An error has occurred while executing your JavaScript code"
                    + ` (${
                        Date.now() - started
                    } ms):\`\`\`\n${
                        error
                    }\`\`\``
                ),
                type: CommandCallResultType.FAILURE,
            };
        }
    }
}
