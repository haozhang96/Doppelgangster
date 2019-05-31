// Import external libraries.
import * as $Discord from "discord.js";

export interface IDiscordGuildAttachable {
    attachGuild(guild: $Discord.Guild): void;
    detachGuild(guild: $Discord.Guild): void;
    isGuildAttached(guild: $Discord.Guild): boolean;
}
