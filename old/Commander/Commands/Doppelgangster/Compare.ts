import * as Discord from "discord.js";

import { Command, ICommandCallContext } from "@/Commander";
import { Profile } from "@";
import * as Utilities from "@/Utilities";


export default class extends Command {
    aliases = ["compare", "comparison"];
    description = "Compare two users' Doppelgangster profiles.";
    permitted = [
        Discord.Permissions.FLAGS.SEND_MESSAGES
    ];
    arguments = [
        { name: "userOne", description: "First user of the comparison" },
        { name: "userTwo", description: "Second user of the comparison" }
    ];
    parameters = {
        similarCharacteristicsOnly: {
            aliases: ["similarOnly", "so"],
            description: "Display only characteristics flagged as similar",
            type: "boolean",
            optional: true
        }
    };

    async handler(context: ICommandCallContext): Promise<void> {
        const   memberOne: Discord.GuildMember | undefined = Utilities.Discord.findMemberInGuildByName(context.message.guild, context.arguments.named.userOne),
                memberTwo: Discord.GuildMember | undefined = Utilities.Discord.findMemberInGuildByName(context.message.guild, context.arguments.named.userTwo);
        
        if (!memberOne)
            return context.message.reply(`no user with "\`${context.arguments.named.userOne}\`" in their name could be found for comparison!`) && undefined;
        else if (!memberTwo)
            return context.message.reply(`no user with "\`${context.arguments.named.userTwo}\`" in their name could be found for comparison!`) && undefined;
        
        if (memberOne.user === memberTwo.user)
            context.message.reply("you cannot compare two of the same user!");
        else {
            const   profileOne: Profile | undefined = await this.commander.doppelgangster.profileMarshal.getUserProfile(memberOne.user),
                    profileTwo: Profile | undefined = await this.commander.doppelgangster.profileMarshal.getUserProfile(memberTwo.user);
            
            if (profileOne && profileTwo) {
                context.message.reply("```" + profileOne.compareTo(profileTwo).toString(context.parameters.similarCharacteristicsOnly).slice(0, 1970) + "```");
            } else
                context.message.reply("at least one of the users do not have a Doppelgangster profile!");
        }
    }
}