// Import internal components.
import { UniquePair, UnorderedPairStore } from "@/common/classes/pair";
import { Optional } from "@/common/types";
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Profile, ProfileComparison } from "@/core/heuristic/profile";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * TODO
 */
export abstract class ProfileController extends Controller {
    // Public properties
    public readonly profiles: Profile[] = [];

    // Protected properties
    protected readonly profileComparisons:
        Map<UniquePair<Profile>, ProfileComparison> = new Map();
    protected readonly profilePairs: UnorderedPairStore<Profile> =
        new UnorderedPairStore();

    public abstract compareProfiles(
        profileOne: Profile,
        profileTwo: Profile,
    ): ProfileComparison;

    public abstract compareUsers(
        userOne: $Discord.User | string,
        userTwo: $Discord.User | string,
        createIfMissing: boolean,
    ): Optional<ProfileComparison>;

    public abstract getComparisonsWithProfile(
        profile: Profile,
    ): ProfileComparison[];

    public abstract getComparisonsWithUser(
        user: $Discord.User | string,
    ): ProfileComparison[];

    public abstract getUserProfile(
        user: $Discord.User | string,
        createIfMissing: boolean,
    ): Optional<Profile>;
}

/**
 * Define the ProfileController's constructor type with the abstract property
 *   removed.
 */
export type ProfileControllerConstructor =
    ControllerConstructor<typeof ProfileController, ProfileController>;
