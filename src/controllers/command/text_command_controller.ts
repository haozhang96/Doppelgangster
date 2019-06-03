// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { DiscordGuildAttachable, Mix } from "@/common/mixins";
import { Nullable, Optional } from "@/common/types";
import { Doppelgangster } from "@/core";
import {
    CommandController, getBuiltInCommandClasses,
} from "@/core/base/controllers";
import {
    Command,
    CommandCallResultType,
    ICommandArguments,
    ICommandCallContext, ICommandCallResult,
    ICommandParameter, ICommandParameters,
    ICommandParsedDescriptor,
} from "@/core/interaction/command";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

// Import configurations.
import * as Configs from "?/controllers/command/text_command_controller";

/**
 * TODO
 */
export class TextCommandController extends Mix(CommandController)
    .with(DiscordGuildAttachable)
.compose() {
    private static _help: Map<Command, string> = new Map();

    /**
     * Return the help documentations string a la command-line style.
     */
    private static getHelp(command: Command): string {
        if (!this._help.has(command)) {
            this._help.set(command, `${ // Description
                command.description
                || "There is no description for this command."
            }\nUsage: ${ // Command aliases
                command.aliases.length > 1 ?
                    "(" + command.aliases.join("|") + ")"
                :
                    command.aliases[0]
            }${ // Required arguments
                command.arguments ?
                    " " + command.arguments.filter((argument) =>
                        !argument.optional,
                    ).map((argument) =>
                        argument.name
                        || "arg" + (
                            (command.arguments as ICommandArguments)
                                .indexOf(argument) + 1
                        ),
                    ).join(" ")
                :
                    ""
            }${ // Required parameters
                command.parameters ?
                    " "
                    + Object.values(command.parameters).filter((parameter) =>
                        !parameter.optional,
                    ).map((parameter) =>
                        `-${ // Find the shortest alias for the parameter.
                            (parameter.aliases || []).concat(
                                Object.keys(
                                    command.parameters as ICommandParameters,
                                ).find((name) =>
                                    (
                                        command.parameters as any
                                    )[name] === parameter,
                                ) || [],
                            ).sort((a, b) => a.length - b.length)[0]
                        } <${
                            parameter.type || "@string"
                        }>`,
                    ).join(" ")
                :
                    ""
            }${ // Full arguments
                command.arguments ?
                    "\n\nArguments:\n\t" + (() => {
                        const names: string[] =
                            command.arguments.map((argument) =>
                                (
                                    argument.name
                                    || "arg" + (
                                        (command.arguments as ICommandArguments)
                                            .indexOf(argument) + 1
                                    )
                                ) + (
                                    argument.default !== undefined ?
                                        "=" + argument.default
                                    : argument.optional ?
                                        "?"
                                    :
                                        ""
                                ),
                            );
                        const types: string[] =
                            command.arguments.map((argument) =>
                                argument.type || "@string",
                            );
                        const descriptions: string[] =
                            command.arguments.map((argument) =>
                                argument.description
                                || "<no description available>",
                            );
                        const maxNameLength: number =
                            names.slice().sort((a, b) =>
                                b.length - a.length,
                            )[0].length;
                        const maxTypeLength: number =
                            types.slice().sort((a, b) =>
                                b.length - a.length,
                            )[0].length;
                        const maxDescriptionLength: number =
                            descriptions.slice().sort((a, b) =>
                                b.length - a.length,
                            )[0].length;
                        return names.map((name, index) =>
                            name.padEnd(maxNameLength)
                            + "      "
                            + types[index].padEnd(maxTypeLength)
                            + "      "
                            + descriptions[index].padEnd(maxDescriptionLength),
                        ).join("\n\t");
                    })()
                :
                    ""
            }${ // Full parameters
                command.parameters ? "\n\nParameters:\n\t" + (() => {
                    const aliases: string[] =
                        Object.keys(command.parameters).map((name) => {
                            const parameter: ICommandParameter = (
                                command.parameters as ICommandParameters
                            )[name];
                            const _aliases: string[] = (
                                parameter.aliases || []
                            ).concat(name);
                            return `-${
                                _aliases.length > 1 ?
                                    "(" + _aliases.filter((alias) =>
                                        alias.length <= 15,
                                    ).sort((a, b) =>
                                        a.length - b.length,
                                    ).join("|") + ")"
                                :
                                    _aliases[0]
                            }${
                                parameter.default !== undefined ?
                                    "=" + parameter.default
                                : parameter.optional ?
                                    "?"
                                :
                                    ""
                            }`;
                        });
                    const types: string[] =
                        Object.values(command.parameters).map((parameter) =>
                            parameter.type || "@string",
                        );
                    const descriptions: string[] =
                        Object.values(command.parameters).map((parameter) =>
                            parameter.description
                            || "<no description available>",
                        );
                    const maxAliasLength: number =
                        aliases.slice().sort((a, b) =>
                            b.length - a.length,
                        )[0].length;
                    const maxTypeLength: number =
                        types.slice().sort((a, b) =>
                            b.length - a.length,
                        )[0].length;
                    const maxDescriptionLength: number =
                        descriptions.slice().sort((a, b) =>
                            b.length - a.length,
                        )[0].length;
                    return aliases.map((alias, index) =>
                        alias.padEnd(maxAliasLength)
                        + "      "
                        + types[index].padEnd(maxTypeLength)
                        + "      "
                        + descriptions[index].padEnd(maxDescriptionLength),
                    ).join("\n\t");
                })() : ""
            }`);
        }
        return this._help.get(command) as string;
    }

    /**
     * Check whether the context of a message has the necessary command
     *   permission.
     * @param message A Discord message to check the permission for
     */
    private static isMessagePermitted(
        command: Command,
        message: $Discord.Message,
    ): boolean {
        // If permitted isn't initialized, assume everyone has permission.
        if (command.permitted === undefined) {
            return true;
        }

        // Check username.
        if (command.permitted.includes(message.author)) {
            return true;
        }

        // Check user ID.
        if (command.permitted.includes(message.author.id)) {
            return true;
        }

        // Check Discord role.
        if (message.member.roles.array().some((role) =>
            command.permitted && command.permitted.includes(role) || false,
        )) {
            return true;
        }

        // Check Discord permission.
        if (command.permitted.some((permission) => {
            try {
                // This might throw an exception on error.
                return message.member.hasPermission(
                    $Discord.Permissions.resolve(permission as any),
                    false, true, true,
                );
            } catch (_) {
                return false;
            }
        })) {
            return true;
        }

        // The user does not have permission to execute this command.
        return false;
    }

    /**
     * Parse a text command and creates a command descriptor from a string.
     * @param input A string
     */
    private static parseCommand(
        input: string,
        prefix: string = Configs.prefix,
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

    /**
     * Construct a TextCommandController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Register built-in commands.
        for (const _Command of getBuiltInCommandClasses()) {
            this.registerInstance(new _Command(doppelgangster));
        }
        doppelgangster.logger.info(
            `Successfully registered ${this.registry.size} built-in ${
                Utilities.string.pluralize("command", this.registry.size)
            }.`,
        );

        // Listen for Doppelgangster guild attachments/detachments.
        doppelgangster.on("guildAttach", (guild) => this.attachGuild(guild));
        doppelgangster.on("guildDetach", (guild) => this.detachGuild(guild));

        // Listen for Discord messages.
        doppelgangster.discord.on("message", async (message) => {
            // Ignore messages in detached guilds.
            if (!this.isGuildAttached(message.guild)) {
                return;
            }

            // Parse the message to build a command descriptor
            let descriptor: ICommandParsedDescriptor;
            try {
                descriptor = TextCommandController.parseCommand(
                    message.content,
                ) as ICommandParsedDescriptor;

                // Make sure the message contains a valid command invocation.
                if (!descriptor) {
                    return;
                }
            } catch (error) {
                this.doppelgangster.logger.warn(
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
            const command: Optional<Command> = this.findInstance((_command) =>
                _command.aliases.some((alias) =>
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

            // Use the command's first alias as its name.
            const commandName: string = command.aliases[0];

            // Make sure the user who sent the command has permission.
            if (!TextCommandController.isMessagePermitted(command, message)) {
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
                    TextCommandController.getHelp(command)
                }\`\`\``);
                return;
            }

            // Build the command's call context from the descriptor
            let context: ICommandCallContext;
            try {
                context = command.buildCallContext(message, descriptor);
            } catch (error) {
                this.doppelgangster.logger.warn(
                    "An error has occurred while building the call context for "
                    + "a command:",
                    Utilities.misc.stringifyError(error),
                );
                message.reply(
                    "an error has occurred while processing your command's "
                    + "arguments/parameters:"
                    + ( // Don't format the message if it comes pre-formatted.
                        error.message.includes("`") ?
                            `\n${error.message}\n`
                        :
                            `\`\`\`\n${
                                error.message || error
                            }\`\`\`\n`
                    )
                    + "If you need help, use the `--help` switch.",
                );
                return;
            }

            // Call and handle the command.
            try {
                this.handleCommandCall(await command.handler(context), message);
            } catch (error) {
                this.doppelgangster.logger.warn(
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

    /**
     * TODO
     * @param result ?
     * @param message ?
     */
    protected async handleCommandCall(
        result: ICommandCallResult,
        message: $Discord.Message,
    ): Promise<void> {
        if (result.type === CommandCallResultType.SUCCESS) {
            await message.reply(
                result.message ?
                    `your command executed successfully:\n${result.message}`
                :
                    "your command executed successfully.",
            );
        } else if (result.type === CommandCallResultType.FAILURE) {
            await message.reply(
                result.message ?
                    `your command failed to execute:\n${result.message}`
                :
                    "your command failed to execute.",
            );
        }

        if (result.callback) {
            result.callback();
        }
    }
}
