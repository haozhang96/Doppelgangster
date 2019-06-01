// Import Doppelgangster components.
import {
    Command, CommandCallResultType, ICommandCallResult,
} from "@/core/interaction/command";

export default class extends Command {
    public aliases = ["quit", "stop", "exit", "terminate", "die"];
    public description =
        "Immediately terminate the Doppelgangster bot (a.k.a. me).";
    public permitted = [
        "147458853456314368",
    ];

    public async handler(): Promise<ICommandCallResult> {
        return {
            callback: async () => {
                await this.doppelgangster.destroy();
                process.exit();
            },
            message: "Doppelgangster is now quitting.",
            type: CommandCallResultType.SUCCESS,
        };
    }
}
