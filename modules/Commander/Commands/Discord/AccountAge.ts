import { Command, ICommandCallContext } from "@/Commander";


export default class extends Command {
    aliases = ["accountage", "accage", "age"];
    description = "Calculate the account age of a Discord user given their user ID.";
    arguments = [
        { name: "userID", description: "User ID for the user to calculate the account age of", type: "number" }
    ];
    
    async handler(context: ICommandCallContext): Promise<void> {
        const createdAt: Date = new Date((context.arguments.named.userID / 4194304) + 1420070400000), now: number = Date.now();

        if (isNaN(createdAt.valueOf()))
            context.message.reply(`the user ID \`${context.arguments.named.userID}\` did not return a valid account creation date!`);
        else
            context.message.reply(`the user with the ID \`${context.arguments.named.userID}\` was created at \`${createdAt.toUTCString()}\`, which was \`${(now - createdAt.valueOf()) / 60000}\` minutes ago.`);
    }
}