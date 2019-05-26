// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { Nullable, Optional } from "@/common/types";
import { Doppelgangster } from "@/core";
import { CommandController } from "@/core/base/controllers";
import { Command, CommandConstructor } from "@/core/interaction/command";
import {
    ICommandCallContext, ICommandParsedDescriptor,
} from "@/core/interaction/command/interfaces";
import * as Utilities from "@/utilities";

// Import configurations.
import * as Configs from "?/controllers/command/text_command_controller";

/**
 * STUB
 */
export class TextCommandController extends CommandController {
    /**
     * Parse a text command and creates a command descriptor from a string.
     * @param input A string
     */
    public static parseCommand(
        input: string,
        prefix: string,
    ): Optional<ICommandParsedDescriptor> {
        // Determine command validity.
        if (
            !input.startsWith(prefix)
            || /^\s+/.test(input = input.slice(prefix.length))
        ) {
            // Make sure the input starts with the prefix and is not followed by
            //   whitespace immediately after.
            return;
        } else if (!(input = input.trim()).length) {
            // Make sure the command isn't empty.
            throw new SyntaxError("The command is empty");
        }

        // Initialize parser state.
        const _arguments: string[] = [];
        const parameters: IMappedObject<string | boolean> = {};
        const tokens: string[] =
            input.trim().split("\n").join("\\n").split(" ");
        const name: Optional<string> = tokens.shift();

        // Make sure a command name is given.
        if (!name) {
            throw new SyntaxError("No command name was provided");
        }

        // Make sure the command name itself is alphanumeric only.
        if (!/^[\w\-]+$/i.test(name)) {
            throw new TypeError("The command name must be alphanumeric only");
        }

        // Parse arguments and parameters.
        for (let index = 0; index < tokens.length; ++index) {
            const token: string = tokens[index];
            const nextToken: string = tokens[index + 1];

            if (token.startsWith("--")) {
                if (token === "--") {
                    throw new SyntaxError("Missing boolean parameter name");
                }

                const test: Nullable<RegExpMatchArray> =
                    token.match(/^\-\-\w[\w\-]*/);
                if (test && test[0].length === token.length) {
                    parameters[token.slice(2).toLowerCase()] = true;
                } else {
                    throw new SyntaxError("Malformed boolean parameter name");
                }
            } else if (/^\-[^\W\d]/.test(token)) {
                if (token === "-") {
                    throw new SyntaxError("Missing parameter name");
                } else if (nextToken === undefined) {
                    throw new SyntaxError(`Missing value for parameter "${
                        token.slice(1)
                    }"`);
                }

                const test: Nullable<RegExpMatchArray> =
                    token.match(/^\-\w[\w\-]*/);
                if (test && test[0].length === token.length) {
                    if (nextToken.startsWith("\"")) {
                        let nextIndex: number = index++;
                        for (
                            let joinedTokens: string =
                                tokens.slice(index, nextIndex + 1).join(" ");
                            nextIndex < tokens.length;
                            joinedTokens =
                                tokens.slice(index, ++nextIndex + 1).join(" ")
                        ) {
                            if (/^@?"(?:[^"\\]|\\.)*"$/.test(joinedTokens)) {
                                parameters[token.slice(1).toLowerCase()] = (
                                    joinedTokens.startsWith("@") ?
                                        "@" + joinedTokens.slice(2, -1)
                                    :
                                        joinedTokens.slice(1, -1)
                                );
                                index = nextIndex;
                                break;
                            }
                        }

                        if (index !== nextIndex) {
                            throw new SyntaxError(
                                `Malformed quoted value for parameter "${
                                    token.slice(1)
                                }"`,
                            );
                        }
                    } else if (!/^[^\\]\"$/.test(nextToken.slice(-2))) {
                        parameters[token.slice(1).toLowerCase()] = nextToken;
                        ++index;
                    } else {
                        throw new SyntaxError(
                            `Malformed unquoted value for parameter "${
                                token.slice(1)
                            }"`,
                        );
                    }
                } else {
                    throw new SyntaxError("Malformed parameter name");
                }
            } else if (/^@?"/.test(token)) {
                let nextIndex: number = index;
                for (
                    let joinedTokens: string =
                        tokens.slice(index, nextIndex + 1).join(" ");
                    nextIndex < tokens.length;
                    joinedTokens =
                        tokens.slice(index, ++nextIndex + 1).join(" ")
                ) {
                    if (/^@?"(?:[^"\\]|\\.)*"$/.test(joinedTokens)) {
                        _arguments.push(
                            joinedTokens.startsWith("@") ?
                                "@" + joinedTokens.slice(2, -1)
                            :
                                joinedTokens.slice(1, -1),
                        );
                        index = nextIndex;
                        break;
                    }
                }

                if (index !== nextIndex) {
                    throw new SyntaxError("Malformed quoted argument");
                }
            } else if (!/^[^\\]\"$/.test(token.slice(-2))) {
                _arguments.push(token);
            } else {
                throw new SyntaxError("Malformed unquoted argument");
            }
        }

        // Unescape arguments
        for (let index = 0; index < _arguments.length; ++index) {
            _arguments[index] =
                Utilities.string.backslashUnescape(_arguments[index]);
        }

        // Unescape parameters
        for (const _name in parameters) {
            if (typeof parameters[_name] === "string") {
                parameters[_name] = Utilities.string.backslashUnescape(
                    parameters[_name] as string,
                );
            }
        }

        // Return command object
        return { name, arguments: _arguments, parameters };
    }

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // TODO
        doppelgangster.discord.on("message", (message) => {
            if (!this._attachedGuilds.includes(message.guild)) {
                return;
            }

            // Parse the message to build a command descriptor
            let descriptor: ICommandParsedDescriptor;
            try {
                descriptor = TextCommandController.parseCommand(
                    message.content, Configs.prefix,
                ) as ICommandParsedDescriptor;

                // Make sure the message contains a valid command invocation.
                if (!descriptor) {
                    return;
                }
            } catch (error) {
                Utilities.logging.warn(
                    "An error has occurred while parsing a command:",
                    Utilities.misc.stringifyError(error),
                );
                message.reply(
                    `an error has occurred while parsing your command:\`\`\`\n${
                        error.message || error
                    }\`\`\``,
                );
                return;
            }

            // Find the command that matches the descriptor's.
            const command: Optional<Command> = this.commands.find((_command) =>
                (_command.constructor as CommandConstructor).aliases.some(
                    (alias) =>
                        Configs.partialCommandMatch ?
                            alias.toLowerCase().startsWith(
                                descriptor.name.toLowerCase(),
                            )
                        :
                            Utilities.string.caseInsensitiveEquals(
                                alias,
                                descriptor.name,
                            ),
                ),
            );

            // Make sure there was a matching command.
            if (!command) {
                message.reply(`the \`${
                    descriptor.name
                }\` command could not be found!`);
                return;
            }

            const commandClass: CommandConstructor = command.constructor as any;
            const commandName: string = commandClass.aliases[0];

            // Make sure the user who sent the command has permission.
            if (!command.isMessagePermitted(message)) {
                message.reply(`you do not have permission to use the \`${
                    commandName
                }\` command!`);
                return;
            }

            // Reply with the help documentations if the help switch was
            //   specified.
            if (Object.keys(descriptor.parameters).some((parameter) =>
                parameter.toLowerCase() === "help",
            )) {
                message.reply(`here are the help documentations for the \`${
                    commandName
                }\` command:\`\`\`\n${
                    command.help
                }\`\`\``);
                return;
            }

            // Build the command's call context from the descriptor
            let context: ICommandCallContext;
            try {
                context = commandClass.buildCallContext(descriptor, message);
            } catch (error) {
                Utilities.logging.warn(
                    "An error has occurred while building the call context for"
                    + "a command:",
                    Utilities.misc.stringifyError(error),
                );
                // TODO: error.message.includes("`")??? Check old code.
                message.reply(
                    "an error has occurred while processing your command's "
                    + "arguments/parameters:"
                    + `\`\`\`\n${
                        error.message || error
                    }\`\`\`\n`
                    + "If you need help, use the `--help` switch.",
                );
                return;
            }

            // Execute the command.
            try {
                command.handler(context);
            } catch (error) {
                Utilities.logging.warn(
                    "An error has occurred while executing a command:",
                    Utilities.misc.stringifyError(error),
                );
                message.reply(
                    "an error has occurred while executing your command:"
                    + `\`\`\`\n${
                        error.message || error
                    }\`\`\``,
                );
            }
        });
    }
}
