// Import internal components.
import { UniquePair } from "@/common/classes/pair";
import { Optional } from "@/common/types";

// Import external libraries.
import * as $Discord from "discord.js";

function findMemberInGuildByName(
    guild: $Discord.Guild,
    name: string,
): Optional<$Discord.GuildMember> {
    return guild.members.find((member) =>
        member.user.username.toLowerCase().includes(name.toLowerCase())
        || (
            member.nickname.length // Nickname might be empty.
            && member.nickname.toLowerCase().includes(name.toLowerCase())
        )
        || false,
    );
}

function formatMessage(message: $Discord.Message): string {
    return `[${message.createdAt.toLocaleString()}] ${message.content}`;
}

function matchMessages(
    groupOne: $Discord.Message[],
    groupTwo: $Discord.Message[],
    predicate: (
        groupOneMessage: $Discord.Message,
        groupTwoMessage: $Discord.Message,
    ) => any,
): Array<UniquePair<$Discord.Message>> {
    const unusedGroupTwoMessages: Set<$Discord.Message> = new Set(groupTwo);
    const matches: Array<UniquePair<$Discord.Message>> = [];

    for (const groupOneMessage of new Set(groupOne)) {
        for (const groupTwoMessage of unusedGroupTwoMessages) {
            if (predicate(groupOneMessage, groupTwoMessage)) {
                /*Logger.trace(
                    "Matched:",
                    groupOneMessage.content, groupTwoMessage.content
                );*/
                matches.push(new UniquePair(groupOneMessage, groupTwoMessage));
                unusedGroupTwoMessages.delete(groupTwoMessage);
                break;
            }
        }
    }

    return matches;
}

// Expose components.
export const DiscordUtils = {
    findMemberInGuildByName,
    formatMessage,
    matchMessages,
};
