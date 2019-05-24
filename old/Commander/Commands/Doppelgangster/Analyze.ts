import * as Discord from "discord.js";

import { Command, ICommandCallContext } from "@/Commander";
import { Profile } from "@";
import * as Utilities from "@/Utilities";


export default class extends Command {
    aliases = ["analyze", "analysis"];
    description = "Analyze a user's Doppelgangster profile.";
    permitted = [
        Discord.Permissions.FLAGS.SEND_MESSAGES
    ];
    arguments = [
        { name: "user", description: "User to analyze" }
    ];
    parameters = {
        suspiciousCharacteristicsOnly: {
            aliases: ["suspiciousOnly", "so"],
            description: "Display only characteristics flagged as suspicious",
            type: "boolean",
            optional: true
        }
    };
    
    async handler(context: ICommandCallContext): Promise<void> {
        const member: Discord.GuildMember | undefined = Utilities.Discord.findMemberInGuildByName(context.message.guild, context.arguments.named.user);

        if (member) {
            const profile: Profile | undefined = await this.commander.doppelgangster.profileMarshal.getUserProfile(member.user);

            if (profile)
                context.message.reply("```" + profile.analysis.toString(context.parameters.suspiciousCharacteristicsOnly).slice(0, 1970) + "```");
            else
                context.message.reply(`"${member.user.username}" does not have a Doppelgangster profile!`);
        } else
            context.message.reply(`no user with "\`${context.arguments.named.user}\`" in their name could be found for analysis!`);
    }
}