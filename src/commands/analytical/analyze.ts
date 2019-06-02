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
    public aliases = ["analyze", "analysis"];
    public description = "Analyze a user's Doppelgangster profile.";
    public arguments = [
        {
            description: "User to analyze",
            name: "user",
        },
    ];
    public parameters = {
        suspiciousCharacteristicsOnly: {
            aliases: ["suspiciousOnly", "so"],
            description: "Display only characteristics flagged as suspicious",
            optional: true,
            type: "boolean",
        },
    };

    public async handler(
        context: ICommandCallContext,
    ): Promise<ICommandCallResult> {
        const member: Optional<$Discord.GuildMember> = (
            context.message ?
                DiscordUtils.findMemberInGuildByName(
                    context.message.guild,
                    context.arguments.named.user,
                )
            :
                DiscordUtils.findMemberByUserID(
                    context.doppelgangster,
                    context.arguments.named.user,
                )
        );

        if (member) {
            const profile: Profile =
                this.doppelgangster.controllers.profile[0].getUserProfile(
                    member.user,
                    true,
                ) as Profile;

            return {
                message: (
                    "```"
                    + profile.analysis.toString(
                        context.parameters.suspiciousCharacteristicsOnly,
                    ).slice(0, 1970)
                    + "```"
                ),
                type: CommandCallResultType.SUCCESS,
            };
        }

        return {
            message: (
                `No user with "\`${
                    context.arguments.named.user
                }\`" in their name could be found for analysis!`
            ),
            type: CommandCallResultType.FAILURE,
        };
    }
}
