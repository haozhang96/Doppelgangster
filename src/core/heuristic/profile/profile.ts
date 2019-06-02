// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { EventEmitter, Expirable, Mix } from "@/common/mixins";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { ProfileController } from "@/core/base/controllers";
import {
    Characteristic, getCharacteristics,
} from "@/core/heuristic/characteristic";
import {
    ProfileAnalysis, ProfileComparison, ProfileReport,
} from "@/core/heuristic/profile";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * TODO
 */
export class Profile extends Mix(DisableableComponent)
    .with(EventEmitter)
    .with(Expirable)
.compose() {
    // Public properties
    public readonly characteristics: ReadonlyArray<Characteristic<any>>;
    public readonly user?: $Discord.User;
    public readonly userID: string;

    // Private properties
    private _analysis?: ProfileAnalysis;
    private _report?: ProfileReport;
    private readonly _reportsAgainst: IMappedObject<ProfileReport> = {};

    /**
     * Construct a Profile instance.
     * @param controller A ProfileController instance to attach to
     */
    constructor(
        public readonly controller: ProfileController,
        user: $Discord.User | string,
    ) {
        super(controller.doppelgangster);

        // Instantiate all characteristics.
        this.characteristics = getCharacteristics().map((_Characteristic) =>
            new _Characteristic(this),
        );

        // Set the user and userID properties based on the passed argument.
        if (user instanceof $Discord.User) {
            this.user = user;
            this.userID = user.id;
        } else {
            this.user = controller.doppelgangster.discord.users.find((_user) =>
                _user.id === user,
            );
            if (this.user) {
                // The user with the given ID has been found.
                this.userID = this.user.id;
            } else {
                // Use only the given ID.
                this.userID = user;
            }
        }
    }

    public get analysis(): ProfileAnalysis {
        if (!this._analysis || this._analysis.expired) {
            this._analysis = new ProfileAnalysis(this);
        }
        return this._analysis;
    }

    public get comparisons(): ProfileComparison[] {
        return this.controller.getComparisonsWithProfile(this);
    }

    public get expired(): boolean {
        if (this._analysis && this._analysis.expired) {
            // The profile's analysis has expired.
            return true;
        } else if (
            this.controller.getComparisonsWithProfile(this).some((comparison) =>
                comparison.expired,
            )
        ) {
            // A profile comparison the profile is associated with has expired.
            return true;
        }
        return false;
    }

    public get report(): ProfileReport {
        if (!this._report || this._report.expired) {
            this._report = new ProfileReport(this, this.controller.profiles);
        }
        return this._report;
    }

    public compareTo(otherProfile: Profile): ProfileComparison {
        return this.controller.compareProfiles(this, otherProfile);
    }

    /**
     * Destroy the Profile instance.
     */
    public destroy(): void {
        return;
    }

    public runReportAgainst(against: Profile[]): ProfileReport {
        // TODO
        const againstGroupID: string =
            against.map((profile) => profile.userID).sort().join(",");

        // TODO
        let report: Optional<ProfileReport> =
            this._reportsAgainst[againstGroupID];

        // TODO
        if (report && !report.expired) {
            return report;
        } else {
            report = new ProfileReport(this, against);
            this._reportsAgainst[againstGroupID] = report;
            return report;
        }
    }
}
