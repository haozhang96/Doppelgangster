// Import internal components.
import { IDiscordGuildAttachable } from "@/common/interfaces/traits/discord";
import { InstantiableClass } from "@/common/types";

// Import external libraries.
import * as $Discord from "discord.js";

export function DiscordGuildAttachable<ClassT extends InstantiableClass>(
    Base: ClassT,
) {
    return class extends Base implements IDiscordGuildAttachable {
        // Private properties
        private readonly _attachedGuilds: $Discord.Guild[] = [];

        public attachGuild(guild: $Discord.Guild): this {
            if (!this._attachedGuilds.includes(guild)) {
                this._attachedGuilds.push(guild);
            }
            return this;
        }

        public detachGuild(guild: $Discord.Guild): this {
            if (this._attachedGuilds.includes(guild)) {
                this._attachedGuilds.splice(
                    this._attachedGuilds.indexOf(guild),
                    1,
                );
            }
            return this;
        }

        public isGuildAttached(guild: $Discord.Guild): boolean {
            return this._attachedGuilds.includes(guild);
        }
    };
}
