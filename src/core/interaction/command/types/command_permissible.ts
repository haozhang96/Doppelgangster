// Import internal components.
import { Optional } from "@/common/types";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * Define a union type used to determine a command's permissions.
 */
export type CommandPermissible = Optional<
    $Discord.User
    | string /* Discord user ID */
    | $Discord.Role
    | $Discord.PermissionResolvable
>;
