import * as VM from "vm";
import * as $Utilities from "util";

import { Command, ICommandCallContext } from "@/Commander";


export default class extends Command {
    aliases = ["evaluate", "js", "console"];
    description = "Evaluate JavaScript code and pretty-print its result.";
    permitted = [
        "147458853456314368"
    ];
    arguments = [
        { name: "code", description: "JavaScript code to run" }
    ];
    parameters = {
        timeout: {
            aliases: ["t", "duration"],
            description: "Execution duration (in milliseconds) before timing out",
            type: "number",
            optional: true,
            default: 5000
        },
        newContext: {
            aliases: ["nc"],
            description: "Run in a new context",
            type: "boolean",
            optional: true
        }
    };
    
    async handler(context: ICommandCallContext): Promise<void> {
        const started: number = Date.now();
        try {
            const returned: any = VM.runInNewContext(context.arguments.named.code, context.parameters.newContext ? undefined : this, { timeout: context.parameters.timeout });
            context.message.reply(`your JavaScript code returned the following (${Date.now() - started} ms):\`\`\`\n${$Utilities.inspect(returned).slice(0, 1900)}\`\`\``);
        } catch (error) {
            context.message.reply(`an error has occurred while executing your JavaScript code (${Date.now() - started} ms):\`\`\`\n${error}\`\`\``);
        }
    }
}