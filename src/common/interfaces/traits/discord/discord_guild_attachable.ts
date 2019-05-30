// Import external libraries.
import * as $Discord from "discord.js";

export interface IDiscordGuildAttachable {
    attachGuild(guild: $Discord.Guild): this | Promise<this>;
    detachGuild(guild: $Discord.Guild): this | Promise<this>;
    isGuildAttached(guild: $Discord.Guild): boolean;
}
