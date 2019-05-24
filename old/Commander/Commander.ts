import * as Discord from "discord.js";

import { Doppelgangster } from "@";
import { Command, ICommandParsedDescriptor, ICommandCallContext } from "../Commander";
import { Commands } from "./Commands";
import { IDiscordGuildAttachable } from "@/Interfaces";
import * as Utilities from "@/Utilities";
import Logger from "@/Logger";
import Configurations from "Configurations";


export class Commander implements IDiscordGuildAttachable {
    // Public properties
    public readonly doppelgangster: Doppelgangster;
    public prefix: string;
    public partialCommandMatch: boolean;

    // Private properties
    private readonly commands: Command[] = Commands.map(Command => new Command(this));
    private readonly attachedGuilds: Discord.Guild[] = [];
    

    /**
     * Creates a Commander instance
     * @param doppelgangster A Doppelgangster instance
     * @param prefix The command prefix
     * @param partialCommandMatch Whether to match command names partially
     */
    constructor(
        doppelgangster: Doppelgangster,
        prefix: string = Configurations.doppelgangster.commander.prefix,
        partialCommandMatch: boolean = Configurations.doppelgangster.commander.partialCommandMatch
    ) {
        this.doppelgangster = doppelgangster; this.prefix = prefix; this.partialCommandMatch = partialCommandMatch;

        doppelgangster.discord.on("message", message => {
            if (this.attachedGuilds.includes(message.guild)) {
                // Parse the message to build a command descriptor
                let descriptor: ICommandParsedDescriptor;
                try {
                    descriptor = Command.parse(message.content, this.prefix) as ICommandParsedDescriptor;
                    if (!descriptor) return; // Make sure the message contains a valid command invocation
                } catch (error) {
                    Logger.warn("An error has occurred while parsing a command:", Utilities.Miscellaneous.stringifyError(error));
                    return message.reply(`an error has occurred while parsing your command:\`\`\`\n${error.message || error}\`\`\``);
                }
                
                // Find the command that matches the descriptor's
                const command: Command | undefined = this.commands.find(command => command.aliases.some(alias =>
                    this.partialCommandMatch ? alias.toLowerCase().startsWith(descriptor.name.toLowerCase()) : alias.toLowerCase() === descriptor.name.toLowerCase()
                )), commandName: string | undefined = command && command.aliases[0];
                if (!command) // Make sure the command exists
                    return message.reply(`the \`${descriptor.name}\` command could not be found!`);
                else if (!command.isMessagePermitted(message)) // Check permission
                    return message.reply(`you do not have permission to use the \`${commandName}\` command!`);
                
                // Reply with the help documentations if the help switch is specified
                if (Object.keys(descriptor.parameters).some(parameter => parameter.toLowerCase() === "help"))
                    return message.reply(`here are the help documentations for the \`${commandName}\` command:\`\`\`\n${command.help}\`\`\``);

                // Build the command's call context from the descriptor
                let context: ICommandCallContext;
                try {
                    context = command.buildCallContext(descriptor, message);
                } catch (error) {
                    Logger.warn("An error has occurred while building the call context for a command:", Utilities.Miscellaneous.stringifyError(error));
                    return message.reply((
                        error.message.includes("`") ? error.message : `an error has occurred while processing your command's arguments/parameters:\`\`\`\n${error.message || error}\`\`\``
                    ) + " If you need help, use the `--help` switch.");
                }

                // Execute the command
                try {
                    command.handler(context);
                } catch (error) {
                    Logger.warn("An error has occurred while executing a command:", Utilities.Miscellaneous.stringifyError(error));
                    message.reply(`an error has occurred while executing your command:\`\`\`\n${error.message || error}\`\`\``);
                }
            }
        });

        Logger.info("Module is ready.");
    }

    public attachGuild(guild: Discord.Guild): this {
		if (!this.isGuildAttached(guild))
			this.attachedGuilds.push(guild);
		return this;
	}

	public detachGuild(guild: Discord.Guild): this {
		if (this.isGuildAttached(guild))
			this.attachedGuilds.splice(this.attachedGuilds.indexOf(guild), 1);
		return this;
	}

	public isGuildAttached(guild: Discord.Guild): boolean {
		return this.attachedGuilds.includes(guild);
	}
}