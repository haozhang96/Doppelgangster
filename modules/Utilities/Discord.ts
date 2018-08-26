import * as $Discord from "discord.js";

import { UniquePair } from "@/Classes/Pair";


export const Discord: {
    formatMessage(message: $Discord.Message): string;
    matchMessages(groupOne: $Discord.Message[], groupTwo: $Discord.Message[], predicate: (groupOneMessage: $Discord.Message, groupTwoMessage: $Discord.Message) => any): UniquePair<$Discord.Message>[];
    findMemberInGuildByName(guild: $Discord.Guild, name: string): $Discord.GuildMember | undefined;
} = {
    formatMessage(message: $Discord.Message): string {
        return `[${message.createdAt.toLocaleString()}] ${message.content}`;
    },

    matchMessages(groupOne: $Discord.Message[], groupTwo: $Discord.Message[], predicate: (groupOneMessage: $Discord.Message, groupTwoMessage: $Discord.Message) => any): UniquePair<$Discord.Message>[] {
        const unusedGroupTwoMessages: Set<$Discord.Message> = new Set(groupTwo), matches: UniquePair<$Discord.Message>[] = [];
        for (const groupOneMessage of new Set(groupOne))
            for (const groupTwoMessage of unusedGroupTwoMessages)
                if (predicate(groupOneMessage, groupTwoMessage)) {
                    // Logger.trace("Matched:", groupOneMessage.content, groupTwoMessage.content);
                    matches.push(new UniquePair(groupOneMessage, groupTwoMessage));
                    unusedGroupTwoMessages.delete(groupTwoMessage); break;
                }
        return matches;
    },

    findMemberInGuildByName(guild: $Discord.Guild, name: string): $Discord.GuildMember | undefined {
        return guild.members.find(member =>
            member.user.username.toLowerCase().includes(name.toLowerCase()) || member.nickname && member.nickname.toLowerCase().includes(name.toLowerCase()) || false
        );
    }
};