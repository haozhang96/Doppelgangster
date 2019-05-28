import { Command, ICommandCallContext } from "@/core/interaction/command";
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

    public async handler(context: ICommandCallContext): Promise<void> {
        const createdAt: Date =
            DiscordUtils.getAccountCreationDate(context.arguments.named.userID);
        const now: number = Date.now();

        if (isNaN(createdAt.valueOf())) {
            context.message.reply(
                `the user ID \`${
                    context.arguments.named.userID
                }\` did not return a valid account creation date!`,
            );
        } else {
            context.message.reply(
                `the user with the ID \`${
                    context.arguments.named.userID
                }\` was created at \`${
                    createdAt.toUTCString()
                }\`, which was \`${
                    (now - createdAt.valueOf()) / 60000
                }\` minutes ago.`,
            );
        }
    }
}
