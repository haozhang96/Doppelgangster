// Import Doppelgangster components.
import {
    Command, CommandCallResultType, ICommandCallResult,
} from "@/core/interaction/command";

export default class extends Command {
    public aliases = ["empty", "nothing"];

    public async handler(): Promise<ICommandCallResult> {
        return {
            type: CommandCallResultType.SUCCESS,
        };
    }
}
