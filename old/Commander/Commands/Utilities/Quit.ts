import { Command, ICommandCallContext } from "@/Commander";


export default class extends Command {
    aliases = ["quit", "stop", "exit", "terminate", "die"];
    description = "Immediately terminate the Doppelgangster bot (a.k.a. me).";
    permitted = [
        "147458853456314368"
    ];
    
    async handler(context: ICommandCallContext): Promise<void> {
        await context.message.reply("Doppelgangster is now quitting.");
        await this.commander.doppelgangster.discord.destroy();
        process.exit();
    }
}