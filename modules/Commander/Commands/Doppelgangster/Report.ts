import * as Discord from "discord.js";

import { Command, ICommandCallContext } from "@/Commander";
import { Profile } from "@";
import * as Utilities from "@/Utilities";


export default class extends Command {
    aliases = ["report"];
    description = "Run a report on a user's Doppelgangster profile.";
    permitted = [
        Discord.Permissions.FLAGS.SEND_MESSAGES
    ];
    arguments = [
        { name: "user", description: "User to run a report on" },
        { name: "...against", description: "Other users to run the report against; if unprovided, the report is run against all other users", optional: true }
    ];
    parameters = {
        suspiciousIncomparableCharacteristicsOnly: {
            aliases: ["suspiciousOnly", "sio"],
            description: "Display only incomparable characteristics flagged as suspicious",
            type: "boolean",
            optional: true
        },
        similarComparableCharacteristicsOnly: {
            aliases: ["similarOnly", "sco"],
            description: "Display only comparable characteristics flagged as similar",
            type: "boolean",
            optional: true
        }
    };

    async handler(context: ICommandCallContext): Promise<void> {
        const member: Discord.GuildMember | undefined = Utilities.Discord.findMemberInGuildByName(context.message.guild, context.arguments.named.user), against: Profile[] = [];

        if (member) {
            const profile: Profile | undefined = await this.commander.doppelgangster.profileMarshal.getUserProfile(member.user);

            if (profile) {
                if (context.arguments.raw.length > 1)
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
                    }
                
                context.message.reply("```" + (against.length ?
                    profile.runReportAgainst(against) :
                    profile.report
                ).toString(
                    context.parameters.suspiciousIncomparableCharacteristicsOnly,
                    context.parameters.similarComparableCharacteristicsOnly
                ).slice(0, 1970) + "```");
            } else
                context.message.reply(`"${member.user.username}" does not have a Doppelgangster profile!`);
        } else
            context.message.reply(`no user with "\`${context.arguments.named.user}\`" in their name could be found for report!`);
    }
}