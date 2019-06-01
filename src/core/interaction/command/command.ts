// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { CommandController } from "@/core/base/controllers";
import {
    CommandArgumentEvaluationError,
    CommandArgumentMissingError, CommandArgumentTypeMismatchError,
    CommandParameterEvaluationError,
    CommandParameterMissingError, CommandParameterNameError,
    CommandParameterTypeMismatchError,
} from "@/core/interaction/command/errors";
import {
    ICommandArgument, ICommandArguments,
    ICommandCallContext,
    ICommandCallContextArguments, ICommandCallContextParameters,
    ICommandCallResult,
    ICommandParameter, ICommandParameters,
    ICommandParsedDescriptor,
} from "@/core/interaction/command/interfaces";
import { CommandPermissible } from "@/core/interaction/command/types";
import * as Utilities from "@/utilities";

// Import built-in libraries.
import { runInNewContext as safeEval } from "vm";

/**
 * TODO
 */
export abstract class Command extends DisableableComponent {
    // Public constants
    // @Override
    public abstract readonly aliases: string[];
    public readonly description?: string;
    public readonly arguments?: ICommandArguments;
    public readonly parameters?: ICommandParameters;
    public readonly permitted?: CommandPermissible[];

    /**
     * Construct a Command instance.
     * @param controller A CommandController instance to attach to
     */
    constructor(public readonly controller: CommandController) {
        super(controller.doppelgangster);
    }

    /**
     * Return the command's name, which would be its first alias.
     */
    public get name(): string {
        return this.aliases[0];
    }

    /**
     * Build a call context from a parsed command descriptor.
     * @param descriptor A parsed command descriptor
     * @param message The Discord message that was used to create the descriptor
     */
    public buildCallContext(
        descriptor: ICommandParsedDescriptor,
    ): ICommandCallContext {
        return {
            arguments: this.buildCallContextArguments(descriptor),
            parameters: this.buildCallContextParameters(descriptor),
        };
    }

    /**
     * Destroy the Command instance.
     */
    public destroy(): void {
        return;
    }

    // @Override
    public abstract async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult>;

    /**
     * Build a call context's arguments from a parsed command descriptor.
     * @param descriptor A parsed command descriptor
     */
    private buildCallContextArguments(
        descriptor: ICommandParsedDescriptor,
    ): ICommandCallContextArguments {
        const rawArguments: any[] = [];
        const namedArguments: IMappedObject<unknown> = {};
        // const commandName: string = this.aliases[0];

        // Calculate the maximum argument index to iterate over.
        const maxIndex: number = (
            this.arguments ?
                Math.max(this.arguments.length, descriptor.arguments.length)
            :
                descriptor.arguments.length
        );

        // TODO
        for (let index = 0; index < maxIndex; index++) {
            // Extract the command's argument at the current index.
            // Note that this may go out of range if the descriptor arguments
            //   array is longer.
            const commandArgument: Optional<ICommandArgument> =
                this.arguments && this.arguments[index];

            // Extract the descriptor's argument at the current index.
            // Note that this may go out of range if the command arguments array
            //   is longer.
            const descriptorArgument: Optional<string> =
                descriptor.arguments[index];

            // Make sure we're still within descriptor arguments' range.
            if (descriptorArgument !== undefined) {
                if (descriptorArgument.startsWith("@")) {
                    // If the descriptor argument was explicitly passed with the
                    //   "@" prefix, do not perform type coercion.
                    rawArguments[index] = descriptorArgument.slice(1);
                } else if (!commandArgument || !commandArgument.type) {
                    // If the command argument does not have a type defined, do
                    //   not perform type coercion.
                    rawArguments[index] = descriptorArgument;
                } else {
                    // Otherwise, attempt to coerce the descriptor argument into
                    //   its real type.
                    let evaluatedArgument: unknown;
                    let evaluatedArgumentType: string;
                    try {
                        // Evaluate the argument.
                        evaluatedArgument = safeEval(
                            descriptorArgument,
                            undefined,
                            { timeout: 100 },
                        );

                        // Determine its type.
                        evaluatedArgumentType =
                            Utilities.reflection.getTypeNames(
                                evaluatedArgument,
                            );
                    } catch (error) {
                        throw new CommandArgumentEvaluationError(
                            this,
                            index,
                            (
                                "An error has occurred while evaluating "
                                + `argument \`${
                                    index + 1
                                }\`${
                                    commandArgument.name !== undefined ?
                                        ` (\`${commandArgument.name}\`)`
                                    :
                                        ""
                                } for the \`${
                                    this.name
                                }\` command:\`\`\`\n${
                                    error.message || error
                                }\`\`\``
                                + "If you do not want the argument to be "
                                + "evaluated, prefix it with \`@\`."
                            ),
                        );
                        /*throw new TypeError(
                            "an error has occurred while evaluating argument "
                            + `\`${
                                index + 1
                            }\`${
                                commandArgument.name !== undefined ?
                                    ` (\`${commandArgument.name}\`)`
                                :
                                    ""
                            } for the \`${
                                commandName
                            }\` command:\`\`\`\n${
                                error.message
                            }\`\`\``
                            + "If you do not want the argument to be evaluated,"
                            + " prefix it with \`@\`.",
                        );*/
                    }

                    // If a specific type is required for the argument, make
                    //   sure it matches.
                    if (
                        !Utilities.string.caseInsensitiveEquals(
                            evaluatedArgumentType,
                            commandArgument.type,
                        )
                    ) {
                        throw new CommandArgumentTypeMismatchError(
                            this,
                            index,
                            evaluatedArgumentType,
                            (
                                `Argument \`${
                                    index + 1
                                }\`${
                                    commandArgument.name !== undefined ?
                                        ` (\`${commandArgument.name}\`)`
                                    :
                                        ""
                                } for the \`${
                                    this.name
                                }\` command expects the type \`${
                                    commandArgument.type.toLowerCase()
                                }\`, but \`${
                                    evaluatedArgumentType.toLowerCase()
                                }\` was given!`
                            ),
                        );
                        /*throw new TypeError(
                            `argument \`${
                                index + 1
                            }\`${
                                commandArgument.name !== undefined ?
                                    ` (\`${commandArgument.name}\`)`
                                :
                                    ""
                            } for the \`${
                                commandName
                            }\` command expects the type \`${
                                commandArgument.type.toLowerCase()
                            }\`, but \`${
                                evaluatedArgumentType.toLowerCase()
                            }\` was given!`,
                        );*/
                    } else {
                        rawArguments[index] = evaluatedArgument;
                    }
                }

                // Map name to the current argument as needed.
                if (commandArgument && commandArgument.name) {
                    namedArguments[commandArgument.name] = rawArguments[index];
                }
            } else if (commandArgument) {
                if (!commandArgument.optional) {
                    // Check if the current argument is required but wasn't
                    //   passed.
                    throw new CommandArgumentMissingError(this, index,
                        `Argument \`${
                            index + 1
                        }\`${
                            commandArgument.name ?
                                ` (\`${commandArgument.name}\`)`
                            :
                                ""
                        }${
                            commandArgument.type ?
                                ` of the type \`${commandArgument.type}\``
                            :
                                ""
                        } is required for the \`${
                            this.name
                        }\` command!`,
                    );
                    /*throw new TypeError(
                        `argument \`${
                            index + 1
                        }\`${
                            commandArgument.name ?
                                ` (\`${commandArgument.name}\`)`
                            :
                                ""
                        }${
                            commandArgument.type ?
                                ` of the type \`${commandArgument.type}\``
                            :
                                ""
                        } is required for the \`${
                            commandName
                        }\` command!`,
                    );*/
                } else if (commandArgument.default !== undefined) {
                    // If nothing was passed for the current argument and it
                    //   isn't required, set it to its default value.
                    rawArguments[index] = commandArgument.default;
                }
            }
        }

        return { raw: rawArguments, named: namedArguments };
    }

    /**
     * Build a call context's parameters from a parsed command descriptor.
     * @param descriptor A parsed command descriptor
     */
    private buildCallContextParameters(
        descriptor: ICommandParsedDescriptor,
    ): ICommandCallContextParameters {
        const parameters: IMappedObject<unknown> = {};
        // const commandName: string = this.aliases[0];

        // Go through an initial loop to match descriptor parameters to command
        //   parameters.
        for (
            const descriptorParameterName of Object.keys(descriptor.parameters)
        ) {
            const descriptorParameter: string | boolean =
                descriptor.parameters[descriptorParameterName];
            let matches: boolean = false;

            if (this.parameters) {
                for (
                    const commandParameterName of Object.keys(this.parameters)
                ) {
                    const commandParameter: ICommandParameter =
                        this.parameters[commandParameterName];

                    // Check if the passed parameter name matches exactly.
                    if (
                        Utilities.string.caseInsensitiveEquals(
                            descriptorParameterName,
                            commandParameterName,
                        )
                    ) {
                        // Check if the parameter matches the key for the
                        //   current command parameter.
                        matches = true;
                    } else if (commandParameter.aliases) {
                        // Check if the parameter matches one of the aliases for
                        //   the current command parameter.
                        for (const parameterAlias of commandParameter.aliases) {
                            if (
                                Utilities.string.caseInsensitiveEquals(
                                    descriptorParameterName,
                                    parameterAlias,
                                )
                            ) {
                                matches = true;
                                break;
                            }
                        }
                    }

                    // If the parameter doesn't match, try the next alias.
                    if (!matches) {
                        continue;
                    }

                    // Process the parameter
                    if (
                        typeof descriptorParameter === "string"
                        && descriptorParameter.startsWith("@")
                    ) {
                        parameters[commandParameterName] =
                            descriptorParameter.slice(1);
                    } else if (!commandParameter.type) {
                        parameters[commandParameterName] = descriptorParameter;
                    } else {
                        let evaluatedParameter: unknown;
                        let evaluatedParameterType: string;
                        try {
                            evaluatedParameter = safeEval(
                                descriptorParameter.toString(),
                                undefined,
                                { timeout: 100 },
                            );
                            evaluatedParameterType =
                                Utilities.reflection.getTypeNames(
                                    evaluatedParameter,
                                );
                        } catch (error) {
                            throw new CommandParameterEvaluationError(
                                this,
                                commandParameterName,
                                (
                                    "An error has occurred while evaluating the"
                                    + ` parameter \`${
                                        commandParameterName
                                    }\` for the \`${
                                        this.name
                                    }\` command:\`\`\`\n${
                                        error.message
                                    }\`\`\``
                                    + "If you do not want the parameter to be "
                                    + "evaluated, prefix it with `@`."
                                ),
                            );
                            /*throw new TypeError(
                                "an error has occurred while evaluating the"
                                + ` parameter \`${
                                    commandParameterName
                                }\` for the \`${
                                    commandName
                                }\` command:\`\`\`\n${
                                    error.message
                                }\`\`\``
                                + "If you do not want the parameter to be "
                                + "evaluated, prefix it with `@`.",
                            );*/
                        }

                        // If a specific type is required for the argument,
                        //   make sure it matches.
                        if (
                            !Utilities.string.caseInsensitiveEquals(
                                evaluatedParameterType,
                                commandParameter.type,
                            )
                        ) {
                            throw new CommandParameterTypeMismatchError(
                                this,
                                commandParameterName,
                                evaluatedParameterType,
                                (
                                    `The parameter \`${
                                        commandParameterName
                                    }\` for the \`${
                                        this.name
                                    }\` command expects the type \`${
                                        commandParameter.type.toLowerCase()
                                    }\`, but \`${
                                        evaluatedParameterType.toLowerCase()
                                    }\` was given!`
                                ),
                            );
                            /*throw new TypeError(
                                `the parameter \`${
                                    commandParameterName
                                }\` for the \`${
                                    commandName
                                }\` command expects the type \`${
                                    commandParameter.type.toLowerCase()
                                }\`, but \`${
                                    evaluatedParameterType.toLowerCase()
                                }\` was given!`,
                            );*/
                        } else {
                            parameters[commandParameterName] =
                                evaluatedParameter;
                        }
                    }

                    // Continue to process the next passed parameter.
                    break;
                }
            }

            if (!matches) {
                // The current passed parameter does not match any of the
                //   command's parameters.
                throw new CommandParameterNameError(
                    this,
                    descriptorParameterName,
                    (
                        `The \`${
                            this.name
                        }\` command does not have a parameter named \`${
                            descriptorParameterName
                        }\`!`
                    ),
                );
                /*throw new TypeError(
                    `the \`${
                        commandName
                    }\` command does not have a parameter named \`${
                        descriptorParameterName
                    }\`!`,
                );*/
            }
        }

        // Go through another loop to check each command parameters optionality
        //   and/or set their default value.
        if (this.parameters !== undefined) {
            for (const commandParameterName of Object.keys(this.parameters)) {
                const commandParameter: ICommandParameter =
                    this.parameters[commandParameterName];

                if (parameters[commandParameterName] === undefined) {
                    if (!commandParameter.optional) {
                        throw new CommandParameterMissingError(
                            this,
                            commandParameterName,
                            (
                                `The parameter \`${
                                    commandParameterName
                                }\`${
                                    commandParameter.type ?
                                        ` of the type \`${
                                            commandParameter.type
                                        }\``
                                    :
                                        ""
                                } is required for the \`${
                                    this.name
                                }\` command!`
                            ),
                        );
                        /*throw new TypeError(
                            `the parameter \`${
                                commandParameterName
                            }\`${
                                commandParameter.type ?
                                    ` of the type \`${commandParameter.type}\``
                                :
                                    ""
                            } is required for the \`${
                                commandName
                            }\` command!`,
                        );*/
                    } else if (commandParameter.default !== undefined) {
                        parameters[commandParameterName] =
                            commandParameter.default;
                    }
                }
            }
        }

        return parameters;
    }
}

/**
 * Define the command's constructor type with the abstract property removed.
 */
export type CommandConstructor = typeof Command & (
    new (controller: CommandController) => Command
);
