// Import internal components.
import { UniquePair } from "@/common/classes/pair";
import { Optional } from "@/common/types";
import { Doppelgangster } from "@/core/doppelgangster";

// Import external libraries.
import * as $Discord from "discord.js";

export function findMemberByUserID(
    doppelgangster: Doppelgangster,
    userID: string,
): Optional<$Discord.GuildMember> {
    for (const guild of doppelgangster.attachedGuilds) {
        for (const [memberID, member] of guild.members) {
            if (memberID === userID) {
                return member;
            }
        }
    }
}

export function findMemberInGuildByName(
    guild: $Discord.Guild,
    name: string,
): Optional<$Discord.GuildMember> {
    return guild.members.find((member) =>
        member.user.username.toLowerCase().includes(name.toLowerCase())
        || (
            member.nickname
            && member.nickname.toLowerCase().includes(name.toLowerCase())
        ) || false,
    );
}

export function formatMessage(message: $Discord.Message): string {
    return `[${message.createdAt.toLocaleString()}] ${message.content}`;
}

export function getAccountCreationDate(userID: string): Date {
    return new Date((+userID / 4194304) + 1420070400000);
}

export function matchMessages(
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
    findMemberByUserID,
    findMemberInGuildByName,
    formatMessage,
    getAccountCreationDate,
    matchMessages,
};
