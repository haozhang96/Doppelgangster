// Import internal components.
import { UniquePair } from "@/common/classes/pair";
import { Optional } from "@/common/types";
import { ProfileController } from "@/core/base/controllers";
import { Profile, ProfileComparison } from "@/core/heuristic/profile";

// Import built-in libraries.
import * as $Discord from "discord.js";

/**
 * The BasicProfileController provides basic profile-marshalling
 *   functionalities.
 */
export class BasicProfileController extends ProfileController {
    public compareProfiles(
        profileOne: Profile,
        profileTwo: Profile,
    ): ProfileComparison {
        const pair: UniquePair<Profile> =
            this.profilePairs.get(profileOne, profileTwo);
        let comparison: Optional<ProfileComparison> =
            this.profileComparisons.get(pair);

        this.doppelgangster.logger.debug(
            `Comparing "${
                profileOne.user ? profileOne.user.username : profileOne.userID
            }" and "${
                profileTwo.user ? profileTwo.user.username : profileTwo.userID
            }": cached[${
                !!comparison
            }], expired[${
                comparison ? comparison.expired : false
            }]`,
        );

        // TODO
        if (comparison && !comparison.expired) {
            return comparison;
        } else {
            comparison = new ProfileComparison(profileOne, profileTwo);
            this.profileComparisons.set(pair, comparison);
            return comparison;
        }
    }

    public compareUsers(
        userOne: $Discord.User | string,
        userTwo: $Discord.User | string,
        createIfMissing: boolean = true,
    ): Optional<ProfileComparison> {
        const profileOne: Optional<Profile> =
            this.getUserProfile(userOne, createIfMissing);
        const profileTwo: Optional<Profile> =
            this.getUserProfile(userTwo, createIfMissing);

        if (profileOne && profileTwo) {
            return this.compareProfiles(profileOne, profileTwo);
        }
    }

    public destroy(): void {
        for (const profile of this.profiles) {
            profile.destroy();
        }
    }

    public getComparisonsWithProfile(profile: Profile): ProfileComparison[] {
        const comparisons: ProfileComparison[] = [];

        for (const [profilePair, comparison] of this.profileComparisons) {
            if (profilePair.one === profile || profilePair.two === profile) {
                comparisons.push(comparison);
            }
        }

        return comparisons;
    }

    public getComparisonsWithUser(
        user: $Discord.User | string,
    ): ProfileComparison[] {
        const userID: string = user instanceof $Discord.User ? user.id : user;
        const comparisons: ProfileComparison[] = [];

        for (const [profilePair, comparison] of this.profileComparisons) {
            if (
                profilePair.one.userID === userID
                || profilePair.two.userID === userID
            ) {
                comparisons.push(comparison);
            }
        }

        return comparisons;
    }

    public getUserProfile(
        user: $Discord.User | string,
        createIfMissing: boolean = true,
    ): Optional<Profile> {
        let profile: Optional<Profile> =
            this.profiles.find((_profile) => _profile.user === user);

        if (profile) {
            return profile;
        } else if (createIfMissing) {
            profile = new Profile(this, user);
            this.profiles.push(profile);
            return profile;
        }
    }
}
