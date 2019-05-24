import { Command, ICommandCallContext } from "@/Commander";


export default class extends Command {
    aliases = ["empty", "nothing"];
    
    async handler(_context: ICommandCallContext): Promise<void> {}
}