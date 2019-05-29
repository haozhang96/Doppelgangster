import {
    Command, CommandCallResultType, ICommandCallContext, ICommandCallResult,
} from "@/core/interaction/command";
import { DiscordUtils } from "@/utilities";

export default class extends Command {
    public aliases = ["accountage", "accage", "age"];
    public description =
        "Calculate the account age of a Discord user given their user ID.";
    public arguments = [
        {
            description: "User ID for the user to calculate the account age of",
            name: "userID",
            type: "number",
        },
    ];

    public async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult> {
        const createdAt: Date =
            DiscordUtils.getAccountCreationDate(context.arguments.named.userID);

        if (isNaN(createdAt.valueOf())) {
            return {
                message: (
                    `the user ID \`${
                        context.arguments.named.userID
                    }\` did not return a valid account creation date!`
                ),
                type: CommandCallResultType.FAILURE,
            };
        }

        return {
            message: (
                `the user with the ID \`${
                    context.arguments.named.userID
                }\` was created at \`${
                    createdAt.toUTCString()
                }\`, which was \`${
                    (Date.now() - createdAt.valueOf()) / 60000
                }\` minutes ago.`
            ),
            type: CommandCallResultType.SUCCESS,
        };
    }
}
