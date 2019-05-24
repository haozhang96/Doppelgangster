import * as Discord from "discord.js";
import { runInNewContext as safeEval } from "vm";

import {
    Commander,
    ICommandArgument, ICommandParameter, ICommandParameters, CommandPermissible,
    ICommandParsedDescriptor,
    ICommandCallContext, ICommandCallContextArguments, ICommandCallContextParameters
} from "../Commander";
import * as Utilities from "@/Utilities";


export abstract class Command {
    // Public properties
    public readonly commander: Commander;
    public abstract readonly aliases: string[];
    public readonly description: string | undefined;
    public readonly arguments: ICommandArgument[] | undefined;
    public readonly parameters: ICommandParameters | undefined;

    // Protected properties
    protected readonly permitted: CommandPermissible[] | undefined;

    // Private properties
    private _help: string | undefined;


    /**
     * Creates a command
     * @param commander A Commander instance
     */
    constructor(commander: Commander) {
        this.commander = commander;
    }

    
    /******************
     * Public methods
     ******************/

    /**
     * Builds a call context from a parsed command descriptor
     * @param descriptor A parsed command descriptor
     * @param message The Discord message that was used to create the descriptor
     */
    public buildCallContext(descriptor: ICommandParsedDescriptor, message: Discord.Message): ICommandCallContext {
        return { message, arguments: this.buildCallContextArguments(descriptor), parameters: this.buildCallContextParameters(descriptor) };
    }

    /**
     * Checks whether the context of a message has the necessary command permission
     * @param message A Discord message
     */
    public isMessagePermitted(message: Discord.Message): boolean {
        return  !this.permitted || // If this.permitted isn't initialized, assume everyone has permission
                /* User */ this.permitted.includes(message.author) ||
                /* User ID */ this.permitted.includes(message.author.id) ||
                /* Role */ message.member.roles.array().some(role => this.permitted && this.permitted.includes(role) || false) ||
                /* Permission */ this.permitted.some(permission => { try { return message.member.hasPermission(Discord.Permissions.resolve(permission as any), false, true, true); } catch (_) { return false; } });
    }

    /**
     * Returns the help documentations string a la command-line style
     */
    public get help(): string {
        return this._help || (this._help = `${ // Description
            this.description || "There is no description for this command."
        }\nUsage: ${ // Command aliases
            this.aliases.length > 1 ? "(" + this.aliases.join("|") + ")" : this.aliases[0]
        }${ // Required arguments
            this.arguments ? " " + this.arguments.filter(argument => !argument.optional).map(argument =>
                argument.name || "arg" + ((this.arguments as ICommandArgument[]).indexOf(argument) + 1)
            ).join(" ") : ""
        }${ // Required parameters
            this.parameters ? " " + Object.values(this.parameters).filter(parameter => !parameter.optional).map(parameter =>
                `-${ // Find the shortest alias for the parameter
                    (parameter.aliases || []).concat(
                        Object.keys(this.parameters as ICommandParameters).find(name => (this.parameters as ICommandParameters)[name] === parameter) || []
                    ).sort((a, b) => a.length - b.length)[0]
                } <${
                    parameter.type || "@string"
                }>`
            ).join(" ") : ""
        }${ // Full arguments
            this.arguments ? "\n\nArguments:\n\t" + (() => {
                const   names: string[] = this.arguments.map(argument =>
                            (
                                argument.name || "arg" + ((this.arguments as ICommandArgument[]).indexOf(argument) + 1)
                            ) + (
                                argument.default !== undefined ? "=" + argument.default :
                                argument.optional ? "?" : ""
                            )
                        ),
                        types: string[] = this.arguments.map(argument => argument.type || "@string"),
                        descriptions: string[] = this.arguments.map(argument => argument.description || "<no description available>"),
                        maxNameLength: number = names.slice().sort((a, b) => b.length - a.length)[0].length,
                        maxTypeLength: number = types.slice().sort((a, b) => b.length - a.length)[0].length,
                        maxDescriptionLength: number = descriptions.slice().sort((a, b) => b.length - a.length)[0].length;
                return names.map((name, index) =>
                    name.padEnd(maxNameLength) + "      " + types[index].padEnd(maxTypeLength) + "      " + descriptions[index].padEnd(maxDescriptionLength)
                ).join("\n\t");
            })() : ""
        }${ // Full parameters
            this.parameters ? "\n\nParameters:\n\t" + (() => {
                const   aliases: string[] = Object.keys(this.parameters).map(name => {
                            const parameter: ICommandParameter = (this.parameters as ICommandParameters)[name], aliases: string[] = (parameter.aliases || []).concat(name);
                            return `-${
                                aliases.length > 1 ? "(" + aliases.filter(alias => alias.length <= 15).sort((a, b) => a.length - b.length).join("|") + ")" : aliases[0]
                            }${
                                parameter.default !== undefined ? "=" + parameter.default :
                                parameter.optional ? "?" : ""
                            }`;
                        }),
                        types: string[] = Object.values(this.parameters).map(parameter => parameter.type || "@string"),
                        descriptions: string[] = Object.values(this.parameters).map(parameter => parameter.description || "<no description available>"),
                        maxAliasLength: number = aliases.slice().sort((a, b) => b.length - a.length)[0].length,
                        maxTypeLength: number = types.slice().sort((a, b) => b.length - a.length)[0].length,
                        maxDescriptionLength: number = descriptions.slice().sort((a, b) => b.length - a.length)[0].length;
                return aliases.map((alias, index) =>
                    alias.padEnd(maxAliasLength) + "      " + types[index].padEnd(maxTypeLength) + "      " + descriptions[index].padEnd(maxDescriptionLength)
                ).join("\n\t");
            })() : ""
        }`);
    }

    /**
     * Parses a command and creates a command descriptor from a string
     * @param input A string
     */
    public static parse(input: string, prefix: string): ICommandParsedDescriptor | undefined {
        // Determine command validity
        if (!input.startsWith(prefix) || /^\s+/.test(input = input.slice(prefix.length))) // Make sure the input starts with the prefix and is not followed by whitespace immediately after
            return;
        else if (!(input = input.trim()).length) // Make sure the command isn't empty
            throw new SyntaxError("The command is empty");

        // Initialization
        const _arguments: string[] = [], parameters: { [name: string]: string | boolean } = {};
        const tokens: string[] = input.trim().split("\n").join("\\n").split(" "), name: string | undefined = tokens.shift();

        // Make sure there is a command name
        if (!name)
            throw new SyntaxError("No command name was provided");

        // Make sure the command name itself is alphanumeric only
        if (!/^[\w\-]+$/i.test(name))
            throw new TypeError("The command name must be alphanumeric only");
        
        // Parse arguments and parameters
        for (
            let currentIndex: number = 0, currentToken: string = tokens[currentIndex], nextToken: string = tokens[currentIndex + 1];
            currentIndex < tokens.length;
            currentToken = tokens[++currentIndex], nextToken = tokens[currentIndex + 1]
        )
            if (currentToken.startsWith("--")) {
                if (currentToken === "--")
                    throw new SyntaxError("Missing boolean parameter name");
                
                const test: RegExpMatchArray | null = currentToken.match(/^\-\-\w[\w\-]*/);
                if (test && test[0].length === currentToken.length)
                    parameters[currentToken.slice(2).toLowerCase()] = true;
                else
                    throw new SyntaxError("Malformed boolean parameter name");
            } else if (/^\-[^\W\d]/.test(currentToken)) {
                if (currentToken === "-")
                    throw new SyntaxError("Missing parameter name");
                else if (nextToken === undefined)
                    throw new SyntaxError(`Missing value for parameter "${currentToken.slice(1)}"`);
                
                const test: RegExpMatchArray | null = currentToken.match(/^\-\w[\w\-]*/);
                if (test && test[0].length === currentToken.length)
                    if (nextToken.startsWith("\"")) {
                        let nextIndex: number = currentIndex++;
                        for (
                            let joinedTokens: string = tokens.slice(currentIndex, nextIndex + 1).join(" ");
                            nextIndex < tokens.length;
                            joinedTokens = tokens.slice(currentIndex, ++nextIndex + 1).join(" ")
                        )
                            if (/^@?"(?:[^"\\]|\\.)*"$/.test(joinedTokens)) {
                                parameters[currentToken.slice(1).toLowerCase()] = joinedTokens.startsWith("@") ? "@" + joinedTokens.slice(2, -1) : joinedTokens.slice(1, -1);
                                currentIndex = nextIndex; break;
                            }
                        
                        if (currentIndex !== nextIndex)
                            throw new SyntaxError(`Malformed quoted value for parameter "${currentToken.slice(1)}"`);
                    } else if (!/^[^\\]\"$/.test(nextToken.slice(-2))) {
                        parameters[currentToken.slice(1).toLowerCase()] = nextToken;
                        currentIndex++;
                    } else
                        throw new SyntaxError(`Malformed unquoted value for parameter "${currentToken.slice(1)}"`);
                else
                    throw new SyntaxError("Malformed parameter name");
            } else if (/^@?"/.test(currentToken)) {
                let nextIndex: number = currentIndex;
                for (
                    let joinedTokens: string = tokens.slice(currentIndex, nextIndex + 1).join(" ");
                    nextIndex < tokens.length;
                    joinedTokens = tokens.slice(currentIndex, ++nextIndex + 1).join(" ")
                )
                    if (/^@?"(?:[^"\\]|\\.)*"$/.test(joinedTokens)) {
                        _arguments.push(joinedTokens.startsWith("@") ? "@" + joinedTokens.slice(2, -1) : joinedTokens.slice(1, -1));
                        currentIndex = nextIndex; break;
                    }
                
                if (currentIndex !== nextIndex)
                    throw new SyntaxError("Malformed quoted argument");
            } else if (!/^[^\\]\"$/.test(currentToken.slice(-2)))
                _arguments.push(currentToken);
            else
                throw new SyntaxError("Malformed unquoted argument");
        
        // Unescape arguments
        for (let index: number = 0; index < _arguments.length; index++)
            _arguments[index] = Utilities.String.backslashUnescape(_arguments[index]);
        
        // Unescape parameters
        for (const name in parameters)
            if (typeof parameters[name] === "string")
                parameters[name] = Utilities.String.backslashUnescape(parameters[name] as string);

        // Return command object
        return { name, arguments: _arguments, parameters };
    }


    /*******************
     * Private methods
     *******************/

    /**
     * Builds a call context's arguments from a parsed command descriptor
     * @param descriptor A parsed command descriptor
     */
    private buildCallContextArguments(descriptor: ICommandParsedDescriptor): ICommandCallContextArguments {
        const rawArguments: any[] = [], namedArguments: { [argument: string]: any; } = {}, commandName: string = this.aliases[0];
        
        for (
            let index: number = 0, descriptorArgument: string = descriptor.arguments[index], commandArgument: ICommandArgument | undefined = this.arguments && this.arguments[index];
            index < (this.arguments ? Math.max(descriptor.arguments.length, this.arguments.length) : descriptor.arguments.length);
            index++, descriptorArgument = descriptor.arguments[index], commandArgument = this.arguments && this.arguments[index]
        ) {
            if (descriptorArgument !== undefined) {
                if (descriptorArgument.startsWith("@")) // If the descriptor argument was explicitly passed with the "@" prefix, do not perform type coercion
                    rawArguments[index] = descriptorArgument.slice(1);
                else if (!commandArgument || !commandArgument.type) // If the command argument does not have a type defined, do not perform type coercion
                    rawArguments[index] = descriptorArgument;
                else { // Otherwise, attempt to coerce the descriptor argument into its real type
                    let evaluatedArgument: any, evaluatedArgumentType: string;
                    try {
                        evaluatedArgument = safeEval(descriptorArgument, undefined, { timeout: 100 }),
                        evaluatedArgumentType = Utilities.Miscellaneous.getTypeOf(evaluatedArgument);
                    } catch (error) {
                        throw new TypeError(
                            `an error has occurred while evaluating argument \`${
                                index + 1
                            }\`${
                                commandArgument.name !== undefined ? ` (\`${commandArgument.name}\`)` : ""
                            } for the \`${
                                commandName
                            }\` command:\`\`\`\n${
                                error.message
                            }\`\`\`If you do not want the argument to be evaluated, prefix it with \`@\`.`
                        );
                    }

                    // If a specific type is required for the argument, make sure it matches
                    if (evaluatedArgumentType.toLowerCase() !== commandArgument.type.toLowerCase())
                        throw new TypeError(
                            `argument \`${
                                index + 1
                            }\`${
                                commandArgument.name !== undefined ? ` (\`${commandArgument.name}\`)` : ""
                            } for the \`${
                                commandName
                            }\` command expects the type \`${
                                commandArgument.type.toLowerCase()
                            }\`, but \`${
                                evaluatedArgumentType.toLowerCase()
                            }\` was given!`
                        );
                    else
                        rawArguments[index] = evaluatedArgument;
                }

                // Map name to the current argument as needed
                if (commandArgument && commandArgument.name)
                    namedArguments[commandArgument.name] = rawArguments[index];
            } else if (commandArgument)
                if (!commandArgument.optional) // Check if the current argument is required but wasn't passed
                    throw new TypeError(
                        `argument \`${
                            index + 1
                        }\`${
                            commandArgument.name ? ` (\`${commandArgument.name}\`)` : ""
                        }${
                            commandArgument.type ? ` of the type \`${commandArgument.type}\`` : ""
                        } is required for the \`${
                            commandName
                        }\` command!`
                    );
                else if (commandArgument.default !== undefined) // If nothing was passed for the current argument and it isn't required, set it to its default value
                    rawArguments[index] = commandArgument.default;
        }

        return { raw: rawArguments, named: namedArguments };
    }

    /**
     * Builds a call context's parameters from a parsed command descriptor
     * @param descriptor A parsed command descriptor
     */
    private buildCallContextParameters(descriptor: ICommandParsedDescriptor): ICommandCallContextParameters {
        const parameters: { [parameter: string]: any; } = {}, commandName: string = this.aliases[0];

        // Go through an initial loop to match descriptor parameters to command parameters
        for (const descriptorParameterName of Object.keys(descriptor.parameters)) {
            const descriptorParameter: string | boolean = descriptor.parameters[descriptorParameterName];
            let matches: boolean = false;
            
            if (this.parameters)
                for (const commandParameterName of Object.keys(this.parameters)) {
                    const commandParameter: ICommandParameter = this.parameters[commandParameterName];

                    // Check if the passed parameter matches
                    if (descriptorParameterName.toLowerCase() === commandParameterName.toLowerCase()) // Check if the parameter matches the key for the current command parameter
                        matches = true;
                    else if (commandParameter.aliases) // Check if the parameter matches one of the aliases for the current command parameter
                        for (const parameterAlias of commandParameter.aliases)
                            if (descriptorParameterName.toLowerCase() === parameterAlias.toLowerCase()) {
                                matches = true; break;
                            }
                    
                    // Process the parameter if it matches
                    if (matches) {
                        if (typeof descriptorParameter === "string" && descriptorParameter.startsWith("@"))
                            parameters[commandParameterName] = descriptorParameter.slice(1);
                        else if (!commandParameter.type)
                            parameters[commandParameterName] = descriptorParameter;
                        else {
                            let evaluatedParameter: any, evaluatedParameterType: string;
                            try {
                                evaluatedParameter = safeEval(descriptorParameter.toString(), undefined, { timeout: 100 }),
                                evaluatedParameterType = Utilities.Miscellaneous.getTypeOf(evaluatedParameter);
                            } catch (error) {
                                throw new TypeError(
                                    `an error has occurred while evaluating the parameter \`${
                                        descriptorParameterName
                                    }\` for the \`${
                                        commandName
                                    }\` command:\`\`\`\n${
                                        error.message
                                    }\`\`\`If you do not want the parameter to be evaluated, prefix it with \`@\`.`
                                );
                            }
                                
                            // If a specific type is required for the argument, make sure it matches
                            if (evaluatedParameterType.toLowerCase() !== commandParameter.type.toLowerCase())
                                throw new TypeError(
                                    `the parameter \`${
                                        commandParameterName
                                    }\` for the \`${
                                        commandName
                                    }\` command expects the type \`${
                                        commandParameter.type.toLowerCase()
                                    }\`, but \`${
                                        evaluatedParameterType.toLowerCase()
                                    }\` was given!`
                                );
                            else
                                parameters[commandParameterName] = evaluatedParameter;
                        }

                        // Continue to process the next passed parameter
                        break;
                    }
                }

            if (!matches) // The current passed parameter does not match any of the command's parameters
                throw new TypeError(
                    `the \`${
                        commandName
                    }\` command does not have a parameter named \`${
                        descriptorParameterName
                    }\`!`
                );
        }

        // Go through another loop to check each command parameters optionality and/or set their default value
        if (this.parameters)
            for (const commandParameterName of Object.keys(this.parameters)) {
                const commandParameter: ICommandParameter = this.parameters[commandParameterName];

                if (parameters[commandParameterName] === undefined)
                    if (!commandParameter.optional)
                        throw new TypeError(
                            `the parameter \`${
                                commandParameterName
                            }\`${
                                commandParameter.type ? ` of the type \`${commandParameter.type}\`` : ""
                            } is required for the \`${
                                commandName
                            }\` command!`
                        );
                    else if (commandParameter.default !== undefined)
                        parameters[commandParameterName] = commandParameter.default;
            }

        return parameters;
    }


    // Extensible methods
    public abstract async handler(context: ICommandCallContext): Promise<void>;
}