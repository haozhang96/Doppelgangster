import * as Discord from "discord.js";


/**
 * Miscellaneous
 */

export interface IScored {
    score: number;
}

export interface IWeighted {
    weight: number;
}

export interface IExemplifiable<T> {
    examples: T[] | ReadonlyArray<T>;
}

export interface IExpirable {
    expired: boolean;
}

export interface ISerializable {
    serialize(): string;
    deserialize(data: string): void;
}


/**
 * Discord
 */

export interface IDiscordGuildAttachable {
    attachGuild(guild: Discord.Guild): this | Promise<this>;
    detachGuild(guild: Discord.Guild): this | Promise<this>;
    isGuildAttached(guild: Discord.Guild): boolean;
}