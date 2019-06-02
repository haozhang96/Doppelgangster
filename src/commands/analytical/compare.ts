// Import Doppelgangster components.
import { Optional } from "@/common/types";
import { Profile } from "@/core/heuristic/profile";
import {
    Command, CommandCallResultType, ICommandCallContext, ICommandCallResult,
} from "@/core/interaction/command";
import { DiscordUtils } from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

export default class extends Command {
    public aliases = ["compare", "comparison"];
    public description = "Compare two users' Doppelgangster profiles.";
    public arguments = [
        {
            description: "First user of the comparison",
            name: "userOne",
        },
        {
            description: "Second user of the comparison",
            name: "userTwo",
        },
    ];
    public parameters = {
        similarCharacteristicsOnly: {
            aliases: ["similarOnly", "so"],
            description: "Display only characteristics flagged as similar",
            optional: true,
            type: "boolean",
        },
    };

    public async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult> {
        const memberOne: Optional<$Discord.GuildMember> = (
            context.message ?
                DiscordUtils.findMemberInGuildByName(
                    context.message.guild,
                    context.arguments.named.userOne,
                )
            :
                DiscordUtils.findMemberByUserID(
                    context.doppelgangster,
                    context.arguments.named.userOne,
                )
        );
        const memberTwo: Optional<$Discord.GuildMember> = (
            context.message ?
                DiscordUtils.findMemberInGuildByName(
                    context.message.guild,
                    context.arguments.named.userTwo,
                )
            :
                DiscordUtils.findMemberByUserID(
                    context.doppelgangster,
                    context.arguments.named.userTwo,
                )
        );

        if (!memberOne) {
            return {
                message: (
                    `No user with "\`${
                        context.arguments.named.userOne
                    }\`" in their name could be found for comparison!`
                ),
                type: CommandCallResultType.FAILURE,
            };
        } else if (!memberTwo) {
            return {
                message: (
                    `No user with "\`${
                        context.arguments.named.userTwo
                    }\`" in their name could be found for comparison!`
                ),
                type: CommandCallResultType.FAILURE,
            };
        }

        const profileOne: Profile =
            this.doppelgangster.controllers.profile[0].getUserProfile(
                memberOne.user,
                true,
            ) as Profile;
        const profileTwo: Profile =
            this.doppelgangster.controllers.profile[0].getUserProfile(
                memberTwo.user,
                true,
            ) as Profile;

        return {
            message: (
                "```"
                + profileOne.compareTo(profileTwo).toString(
                    context.parameters.similarCharacteristicsOnly,
                ).slice(0, 1970)
                + "```"
            ),
            type: CommandCallResultType.SUCCESS,
        };
    }
}
