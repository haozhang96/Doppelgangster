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
    public aliases = ["report"];
    public description = "Run a report on a user's Doppelgangster profile.";
    public arguments = [
        {
            description: "User to run a report on",
            name: "user",
        },
        {
            description: (
                "Other users to run the report against; if unprovided, the "
                + "report is run against all other users"
            ),
            name: "...against",
            optional: true,
        },
    ];
    public parameters = {
        similarComparableCharacteristicsOnly: {
            aliases: ["similarOnly", "sco"],
            description: (
                "Display only comparable characteristics flagged as similar"
            ),
            optional: true,
            type: "boolean",
        },
        suspiciousIncomparableCharacteristicsOnly: {
            aliases: ["suspiciousOnly", "sio"],
            description: (
                "Display only incomparable characteristics flagged as "
                + "suspicious"
            ),
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

        if (!member) {
            return {
                message: (
                    `No user with "\`${
                        context.arguments.named.user
                    }\`" in their name could be found for report!`
                ),
                type: CommandCallResultType.FAILURE,
            };
        }

        const profile: Profile =
            this.doppelgangster.controllers.profile[0].getUserProfile(
                member.user,
                true,
            ) as Profile;
        const against: Profile[] = [];

        /*if (context.arguments.raw.length > 1)
            for (const otherUser of context.arguments.raw.slice(1)) {
                const otherMember: Discord.GuildMember | undefined = Utilities.Discord.findMemberInGuildByName(context.message.guild, otherUser);

                if (otherMember) {
                    const otherProfile: Profile | undefined = await this.commander.doppelgangster.profileMarshal.getUserProfile(otherMember.user);

                    if (otherProfile)
                        against.push(otherProfile);
                    else
                        return context.message.reply(`"${otherMember.user.username}" does not have a Doppelgangster profile!`) && undefined;
                } else
                    return context.message.reply(`no user with "\`${otherMember}\`" in their name could be found for report!`) && undefined;
            }*/

        return {
            message: (
                "```"
                + (against.length ?
                    profile.runReportAgainst(against) :
                    profile.report
                ).toString(
                    context.parameters.suspiciousIncomparableCharacteristicsOnly,
                    context.parameters.similarComparableCharacteristicsOnly,
                ).slice(0, 1970)
                + "```"
            ),
            type: CommandCallResultType.SUCCESS,
        };
    }
}
